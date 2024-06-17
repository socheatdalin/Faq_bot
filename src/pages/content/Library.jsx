import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrashIcon } from "@heroicons/react/24/solid";
import { useParams } from 'react-router-dom';

const Library = () => {
  const { subcategory_name, category_name } = useParams();
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async (category_name, subcategory_name) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/categories/${category_name}/${subcategory_name}`);
      setFaqData(response.data);
      console.log("result", response.data)
      console.log("res", response.data.questions)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const deleteQuestion = async (question_index) => {
    try {
      if (question_index < 0 || question_index >= faqData.length) {
        throw new Error('Invalid question index');
      }

      const response = await fetch(`http://localhost:8000/delete_question/${category_name}/${subcategory_name}/${question_index}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }
      console.log('sucees')

      setFaqData(prevQuestions => prevQuestions.filter((_, i) => i !== question_index));
      window.location.href = window.location.href;
    }

    catch (error) {
      console.error('Error deleting question:', error);

    }
  };
  
  useEffect(() => {
    console.log("subcategory_name from URL:", category_name, subcategory_name);
    if (category_name, subcategory_name) {
      getData(category_name, subcategory_name);
    }
  }, [category_name, subcategory_name]);

  const flattenData = (data) => {
    if (!data || !Array.isArray(data.questions)) {
      console.error("Data is not in expected format or questions are not an array");
      return [];
    }
    return data.questions.map((question) => ({
      question: question.question,
      answer: question.answer,
    }));
  };

  const flattenedData = faqData ? flattenData(faqData) : [];
  return (
    <div className='bg-gray-100 rounded-xl overflow-auto m-5 w-full ' >
      <div className='p-2 m-2'>
        <h1 className=' font-bold text-xl my-2'>{subcategory_name.toUpperCase()}</h1>
        {/* <p>This page wil show all Faq </p> */}
      </div>
      <div className="flex flex-col ">
        <div className="">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-base font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">#</th>
                    <th scope="col" className="px-6 py-4">Question</th>
                    <th scope="col" className="px-6 py-4">Answer</th>
                    <th scope="col" className="px-6 py-4">Type</th>
                  </tr>
                </thead>
                <tbody className='py-5'>
                  {flattenedData.length === 0 ? (
                    <tr>
                      <td colSpan="3" className='p-5 text-xl'>No data available</td>
                    </tr>
                  ) : (
                    flattenedData.map((row, index) => (
                      <tr key={index} className='*:whitespace-nowrap *:px-6 *:py-4 *:font-medium'>
                        <td>{index + 1}</td>
                        <td>{row.question}</td>
                        <td>{row.answer}</td>
                        <td>{subcategory_name}</td>
                        <td>
                          <button className='bg-blue-100 p-2 rounded-xl' onClick={() => deleteQuestion(index)}>
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
