import axios, { Axios } from "axios"

const questionService = {
    create:async(categoryName, subcategoryName, questionData)=>{
        const formData = new FormData();
        formData.append('question', questionData.question);
        formData.append('answer', questionData.answer);
        if (questionData.file) {
          formData.append('file', questionData.file);
        }
      
        const response = await axios.post(`http://127.0.0.1:8000/category/${categoryName}/subcategory/${subcategoryName}/question`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
    },
    delect:async(categoryName, subcategoryName, questionIndex) =>{
        const response = await axios.delete(`http://127.0.0.1:8000/delete_question/${categoryName}/${subcategoryName}/${questionIndex}`);
        return response.data;
    }
} 

export default questionService;