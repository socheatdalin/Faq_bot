import React, { useEffect, useState } from "react"
import { Card } from '@mui/joy'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import categoryService from "../../service/category";
import subcategoryService from "../../service/subcategory"

export default function Sidebar() {
    const [loading, setLoading] = useState([])
    const [show, setShow] = useState(false);
    const [category, setCategory] = useState([])
    const [subcategory, setSubcategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')

    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    };
    const openDialog = () => {
        setShow(true);
    };

    const closeDialog = () => {
        setShow(false);
    };
    const get_category = async () => {
        try {
            const response = await categoryService.getCategory()
            setCategory(response);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const get_subcategory = async (categoryItem) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/find_subcategory/${categoryItem}`);
            setSubcategory(prev => ({
                ...prev,
                [categoryItem]: response.data
            }));
            console.log(subcategory)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    const handleCreateQuestion = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('question', question);
        formData.append('answer', answer);
        if (file) {
            formData.append('file', file);
        }

        try {
            await axios.post(`http://127.0.0.1:8000/categories/${selectedCategory}/subcategories/${selectedSubcategory}/questions/`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            closeDialog();
            window.location.reload();
        } catch (error) {
            console.error('Error uploading question:', error);
        }
    }

    useEffect(() => {

        get_category()
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            get_subcategory(selectedCategory);
        }
    }, [selectedCategory]);
    return (
        <div>
            <div className=" m-5 flex justify-end">
                <Button label="Create Question" icon="pi pi-external-link" onClick={openDialog} className="w-fit bg-blue-300 p-1.5 rounded-lg" />
            </div>
            <Dialog className="bg-gray-200 p-3 w-96 " visible={show} onHide={() => setShow(false)}>
                <div className="grid *:my-2 ">
                    <h1 className="font-bold text-2xl ">Create Question</h1>
                    <form action="" onSubmit={handleCreateQuestion} className=" ">
                        <select
                            name="category"
                            id=""
                            className="p-3 m-2 rounded-lg outline outline-2 outline-gray-500 w-80 "
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            value={selectedCategory}
                        >
                            <option value="">Select a category</option>
                            {category.map((item, index) => (
                                <option value={item} key={index}>{item}</option>
                            ))}
                        </select>


                        {selectedCategory && subcategory[selectedCategory] && (
                            <select
                                name="subcategory"
                                id=""
                                className="p-3 m-2 rounded-lg outline outline-2 outline-gray-500 w-80 "
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                                value={selectedSubcategory}
                            >
                                <option value="">Select a subcategory</option>
                                {subcategory[selectedCategory].map((item, index) => (
                                    <option value={item} key={index} >{item}</option>
                                ))}
                            </select>
                        )}
                        <input type="text" name="question" id="" value={question} placeholder="please input question " label="question" className="w-80 p-2 m-2 rounded-lg outline outline-2 outline-gray-500" onChange={(e) => setQuestion(e.target.value)} />
                        <input type="text" name="answer" id="" value={answer} placeholder="please input answer " label="Answer" className="w-80 p-2 m-2 rounded-lg outline outline-2 outline-gray-500" onChange={(e) => setAnswer(e.target.value)} />
                        <input type="file" name="file" id="" onChange={handleFileChange} className="p-2 rounded-lg" />
                        <div className="flex justify-center w-full bg-blue-300 rounded-lg p-2">
                            <button type="submit" className="  ">Create</button>
                        </div>

                    </form>
                </div>
            </Dialog>
        </div>
    );
}