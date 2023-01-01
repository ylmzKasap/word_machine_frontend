import axios from 'axios';
import { useContext } from 'react';
import { isProduction, serverUrl } from '../../../constants';
import { QuestionContext } from '../../question_intro/question_intro';
import { QuestionContextTypes } from '../../types/QuestionPageTypes';

export const ImageInfo: React.FC<ImageInfoTypes> = (props) => {
  const { setQuestionPage } = useContext(QuestionContext) as QuestionContextTypes;

  const handleClick = () => {
    setQuestionPage({type: 'requestMessage', value: 
        {loading: true, description: ' '}});
    axios
      .get(`${isProduction ? serverUrl : ''}/image_details/${props.imageId}`)
      .then(res => {
        const { artist_name, submitted_by, image_approved } = res.data[0];
        let references = [];
        for (let image of res.data) {
          references.push(image.reference_link);
        }
        setQuestionPage({type: 'imageDetails', value: {
          view: true,
          artistName: artist_name,
          references: references,
          submittedBy: submitted_by,
          approved: image_approved
        }});
      })
      .catch(err => {
        setQuestionPage({type: 'requestMessage', value: 
        {loading: false, description: err.response.data.errDesc}});
      });
  };
  
  return <i 
    className="fa-solid fa-circle-info"
    onClick={handleClick} />;
};

export interface ImageInfoTypes {
  imageId: string;
};
