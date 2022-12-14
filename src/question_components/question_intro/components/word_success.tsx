import { useContext, useEffect } from 'react'; 
import axios from 'axios';
import { WordTypes } from '../../../profile_components/types/profilePageTypes';
import { QuestionContextTypes } from '../../types/QuestionPageTypes';
import { QuestionContext } from '../question_intro';

import { useState } from 'react';
import { format_date } from '../../common/utils';
import { Link, useParams } from 'react-router-dom';
import { requestMessageDefault } from '../../../profile_components/types/profilePageDefaults';
import { isProduction, serverUrl } from '../../../constants';

export const WordSuccess: React.FC<WordSuccessTypes> = ({ title, type }) => {
  const params = useParams();
  const { 
    questionPage,
    setQuestionPage,
    reRender } = useContext(QuestionContext) as QuestionContextTypes;

  const [sortType, setSortType] = useState({column: '', descending: false});
  const [wordStats, setWordstats] = useState<WordStatsTypes[]>([]);
  const [deckCloned, setDeckCloned] = useState(false);
  const allHeaders = ['#', 'Word', 'Success', 'Revisions', 'Last revision'];  
  // Calculate success breakdown and sort rows
  useEffect(() => {
    const { target_language: targetLanguage, words } = questionPage.wordInfo;

    const wordStats = words.map(word => {
      let successRate = 0;
      if (word.correct_answer || word.incorrect_answer) {
        successRate = (word.correct_answer / (word.correct_answer + word.incorrect_answer)) * 100;
      }

      return {
        word: word[targetLanguage as keyof WordTypes] as string,
        correctAnswer: word.correct_answer,
        incorrectAnswer: word.incorrect_answer,
        successRate: successRate,
        wordOrder: word.word_order,
        lastReview: word.last_review!
      };
    });

    let sortedStats : typeof wordStats;
    if (sortType.column === 'Word') {
      sortedStats = wordStats.sort((a, b) => {
        if (sortType.descending) {
          return a.word >= b.word ? -1 : 1;
        } else {
          return a.word >= b.word ? 1 : -1;
        }
      });
    } 
    
    else if (sortType.column === 'Success') {
      sortedStats = wordStats.sort((a, b) => sortType.descending 
        ? b.successRate - a.successRate
        : a.successRate - b.successRate);
    } 
    
    else if (sortType.column === 'Revisions') {
      sortedStats = wordStats.sort((a, b) => sortType.descending 
        ? (b.incorrectAnswer + b.correctAnswer) - (a.incorrectAnswer + a.correctAnswer)
        : (a.incorrectAnswer + a.correctAnswer) - (b.incorrectAnswer + b.correctAnswer));
    } 
    
    else if (sortType.column === 'Last revision') {
      sortedStats = wordStats.sort((a, b) => {
        const aLastReview = a.lastReview ? Date.parse(a.lastReview) : new Date('January 1, 2022');
        const bLastReview = b.lastReview ? Date.parse(b.lastReview) : new Date('January 1, 2022');
        const aDate = new Date(aLastReview).valueOf();
        const bDate = new Date(bLastReview).valueOf();
        return sortType.descending ? bDate - aDate : aDate - bDate;
      });
    } 
    
    else {
      sortedStats = wordStats.sort((a, b) => a.wordOrder - b.wordOrder);
    }

    setWordstats(sortedStats);
    
  }, [sortType, reRender]);

  const handleSortClick = (event: React.MouseEvent) => {
    const element = event.currentTarget as HTMLDivElement;
    if (sortType.column === element.textContent) {
      if (sortType.descending) {
        setSortType({column: '', descending: false});
      } else {
        setSortType(prev => ({...prev, descending: true}));
      }
    } else {
      setSortType({column: element.textContent!, descending: false});
    }
  };;

  const handleCloneClick = () => {
    setQuestionPage({type: 'requestMessage', value: {loading: true, description: 'Cloning...'}} );
    setDeckCloned(true);
    axios.post(`${isProduction ? serverUrl : ''}/clone`, {
      item_id: questionPage.wordInfo.words[0].deck_id
        ? questionPage.wordInfo.words[0].deck_id
        : window.location.pathname.split('/')[3]
    }).then((res) => {
      const item_id = res.data.item_id as string;
      setQuestionPage({type: 'requestMessage', value: {
        loading: false,
        description: ' ',
        link: `/deck/${questionPage.deckInfo.logged_in_user}/${item_id}`,
        linkDescription: 'View deck'
      }});
    }).catch(() => {
      setDeckCloned(false);
      setQuestionPage({type: 'requestMessage', value: requestMessageDefault});
    });
  };

  const createHeaders = () => {
    return allHeaders.map((header, i) => {
      return <th 
        onClick={handleSortClick}
        key={`${header}-${i}`}>
        {header}
        {sortType.column === header && sortType.descending && header !== '#' &&
          <i className="fa-solid fa-angle-down" />}
        {sortType.column === header && !sortType.descending && header !== '#' &&
        <i className="fa-solid fa-angle-up" />}
      </th>;
    });
  };

  const createWordRows = () => {
    const existingWords = wordStats.filter(word => word.word);
    const allRows = existingWords.map((word, i) => { 
      return (
        <tr className="word-stats-row" key={`${word.word}-${i}`}>
          <td>{i + 1}</td>
          <td>{word.word}</td>
          <td>
            {word.successRate.toFixed(1)}%
            <div className="word-success-bar">
              <div 
                className="green-success-bar"
                style={{'width': `${word.successRate}%`}}></div>
              <div 
                className="red-success-bar"
                style={word.lastReview
                  ? {'width': `${100 - word.successRate}%`}
                  : {}}></div>
            </div>
          </td>
          <td>{word.correctAnswer + word.incorrectAnswer}</td>
          <td>{word.lastReview ? format_date(word.lastReview) : 'Not yet studied'}</td>
        </tr>
      );
    });
    return allRows.length 
      ? allRows 
      : <tr className="word-stats-row">
        <td colSpan={6}>This {type} has no words yet</td>
      </tr> ;
  };

  const { logged_in_user, username } = questionPage.deckInfo;
  return (
    <div id="word-success">
      <div id="deck-name-intro">
        {title}
      </div>
      {logged_in_user !== null && !logged_in_user &&
          <div id="please-login-deck-stats">
            <Link
              to="/login"
              className="switch-form-button"
              state={{
                next: `/deck/${params.username}/${params.deckId}`}}
            >Log in</Link> to save your progress
          </div>
      }
      {logged_in_user && logged_in_user !== username &&
          <div id="please-login-deck-stats">
            {!deckCloned 
              ? <>
                <span 
                  className="switch-form-button"
                  onClick={handleCloneClick}>Clone</span> this deck to save your progress
              </>
              : <span>Cloned!</span> 
            }   
          </div>
      }
      <div id="deck-table-container">
        <table id="deck-stats-table">
          <colgroup>
            <col className="word-index" />	
            <col className="word-column" />	
            <col className="word-success-column" />
            <col className="word-revision-column" />
            <col className="word-date-column" />
          </colgroup>
          <thead>
            <tr id="deck-stats-header">
              {createHeaders()}
            </tr>
          </thead>
          <tbody>
            {createWordRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface WordSuccessTypes {
  title: string;
  type: string;
}

interface WordStatsTypes {
  word: string;
  correctAnswer: number;
  incorrectAnswer: number;
  successRate: number;
  lastReview: string;
}
