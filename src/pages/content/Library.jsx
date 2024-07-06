import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import questionService from '../../service/questions';
import TopBar from '../../components/common/topbar'

const Library = () => {
  const { subcategory_name, category_name } = useParams();
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [updaetDialog, setUpdateDialog] = useState(false);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [file, setFile] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [question_index, setQuestionIndex] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newFile, setNewFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    openUpdateDialog();
    setNewQuestion(faqData.questions[index].question);
    setNewAnswer(faqData.questions[index].answer);
  };

  const getData = async (category_name, subcategory_name) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/categories/${category_name}/${subcategory_name}`);
      setFaqData(response.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (categoryName, subcategoryName, questionIndex) => {
    try {
      await questionService.delect(categoryName, subcategoryName, questionIndex);
      getData(categoryName, subcategoryName); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('new_question', newQuestion);
    formData.append('new_answer', newAnswer);
    if (newFile) {
      formData.append('new_file', newFile);
    }
    console.log(category_name, subcategory_name, editIndex); // Debugging line

    try {
      await axios.patch(`http://127.0.0.1:8000/update_question/${category_name}/${subcategory_name}/${editIndex}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setEditIndex(null);
      setUpdateDialog(false);
      getData(category_name, subcategory_name); // Refresh data after update
      // window.location.reload();
    } catch (error) {
      console.error("There was an error updating the question!", error);
    }
  };

  useEffect(() => {
    if (category_name && subcategory_name) {
      getData(category_name, subcategory_name);
    }
  }, [category_name, subcategory_name]);



  const flattenData = (data) => {
    if (!data || !Array.isArray(data.questions)) {
      console.error("Data is not in expected format or questions are not an array", data);
      return [];
    }
    return data.questions.map((question) => ({
      question: question.question,
      answer: question.answer,
    }));
  };

  const flattenedData = flattenData(faqData);

  const openDialog = () => {
    setShow(true);
  };

  const closeDialog = () => {
    setShow(false);
  };

  const openUpdateDialog = () => {
    setUpdateDialog(true);
  };

  const closeUpdateDialog = () => {
    setUpdateDialog(false);
  };

  return (
    <div className='w-full'>
      <TopBar />
      <div className='m-5 bg-gray-100 p-2 rounded-xl px-5'>
        <div className='p-2 m-2'>
          <h1 className='font-bold text-xl my-2'>{subcategory_name.toUpperCase()}</h1>
        </div>
        <div className="flex flex-col">
          <div className="">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="">
                <table className="min-w-full text-left text-base font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">#</th>
                      <th scope="col" className="px-6 py-4">Question</th>
                      <th scope="col" className="px-6 py-4">Answer</th>
                      <th scope="col" className="px-6 py-4">Type</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className='py-5'>
                    {flattenedData.length === 0 ? (
                      <tr>
                        <td colSpan="3" className='p-5 text-xl'>No data available</td>
                      </tr>
                    ) : (
                      flattenedData.map((row, index) => (
                        <tr key={index} className='*:whitespace-nowrap *:px-2 *:py-1 *:font-medium'>
                          <td>{index + 1}</td>
                          <td>{row.question}</td>
                          <td>{row.answer}</td>
                          <td>{subcategory_name}</td>
                          <td className='flex gap-3'>
                            <button className='text-red-700' onClick={() => handleEditClick(index)}><PencilSquareIcon className="h-5 w-5" /></button>
                            <button className='text-red-500' onClick={openDialog}><TrashIcon className="h-5 w-5" /></button>
                          </td>
                          <Dialog visible={show} onHide={() => setShow(false)} className="bg-gray-200 p-3 w-96 rounded-lg">
                            <h1 className="font-bold text-center text-xl text-red-600">Delete</h1>
                            <p className="text-center my-2">Are you sure you want to delete?</p>
                            <div className="flex gap-5 justify-center my-3 *:bg-blue-200 *:p-2 *:rounded-lg">
                              <button className="" onClick={closeDialog}>Cancel</button>
                              <button onClick={() => deleteQuestion(category_name, subcategory_name, index)}>Delete</button>
                            </div>
                          </Dialog>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Dialog visible={updaetDialog} onHide={() => setUpdateDialog(false)} className="bg-gray-200 p-3 w-96 rounded-lg">
          <h1 className="font-bold text-xl my-2">Update</h1>
          <form onSubmit={handleUpdate}>
            <input
              name="Question"
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="please input new question"
              className="w-80 p-2 m-2 rounded-lg outline outline-2 outline-gray-500"
            />
            <input
              name="Answer"
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="please input new answer"
              className="w-80 p-2 m-2 rounded-lg outline outline-2 outline-gray-500"
            />
            <input type="file" name="file" id="" onChange={handleFileChange} className="p-2 rounded-lg" />
            <div className="flex justify-center w-full bg-blue-300 rounded-lg p-2">
              <button type="submit" className="">Create</button>
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default Library;
