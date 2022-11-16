import { useContext, useEffect } from 'react'; 
import { WordTypes } from '../../../profile_components/types/profilePageTypes';
import { QuestionContextTypes } from '../../types/QuestionPageTypes';
import { QuestionContext } from '../question_intro';

import { useState } from 'react';
import { format_date } from '../../common/utils';
import { Link, useParams } from 'react-router-dom';

export const WordSuccess: React.FC<WordSuccessTypes> = ({ title }) => {
  const params = useParams();
  const { questionPage, reRender } = useContext(QuestionContext) as QuestionContextTypes;

  const [sortType, setSortType] = useState({column: '', descending: false});
  const [wordStats, setWordstats] = useState<WordStatsTypes[]>([]);
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
        const aDate = new Date(Date.parse(a.lastReview)).valueOf();
        const bDate = new Date(Date.parse(b.lastReview)).valueOf();
        return sortType.descending ? bDate - aDate : aDate - bDate;
      });
    } 
    
    else {
      return setWordstats(wordStats);
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

  const { logged_in_user } = questionPage.deckInfo;
  return (
    <div id="word-success">
      <div id="deck-name-intro">
        {title}
      </div>
      <div id="deck-table-container">
        {logged_in_user &&
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
            {wordStats.map((word, i) => {
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
            })}
          </tbody>
        </table>}
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
      </div>
    </div>
  );
};

interface WordSuccessTypes {
  title: string;
}

interface WordStatsTypes {
  word: string;
  correctAnswer: number;
  incorrectAnswer: number;
  successRate: number;
  lastReview: string;
}
