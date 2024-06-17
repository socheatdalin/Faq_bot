import React, { useEffect, useState } from "react"
import { Flex, Box, Card, Typography } from '@mui/joy'
import { List, ListItem } from "@material-tailwind/react";
import axios from "axios";
import { PresentationChartBarIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';

export default function Subcategory() {

    const [loading, setLoading] = useState([])
    const [category, setCategory] = useState([])
    const [openCategory, setopenCategory] = useState(false);
    const [show, setShow] = useState(false);
    const [openSubcategory, setOpenSubcategory] = useState(false);
    const [categoryName, setCategoryname] = useState("");
    const [subcategoryName, setSubcategoryname] = useState("");
    const [message, setMessage] = useState("");
    const [categoryCount, setCategoryCount] = useState(null);
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [subcategory, setSubcategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
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
        setMessage('');
    };

    const openDialogCategory = () => {
        setopenCategory(true);
    };

    const closeDialogCategory = () => {
        setopenCategory(false);
        setMessage('');
    };
    const openDialogSubcategory = () => {
        setOpenSubcategory(true);
    };

    const closeDialogSubcategory = () => {
        setOpenSubcategory(false);
        setMessage('');
    };
    const get_category_count = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/count-category");
            setCategoryCount(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const get_category = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/find_category");
            setCategory(response.data);

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

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    const handleCreateSubcategory = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://127.0.0.1:8000/categories/${selectedCategory}/subcategories/ `, {
                subcategory_name: subcategoryName,
            });
            closeDialogSubcategory();
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.detail}`);
            } else {
                setMessage("An error occurred");
            }
        }
    }

    
    useEffect(() => {
      
        // get_category_count()

    }, [])
    useEffect(() => {
        if (category.length > 0) {
            category.forEach(categoryItem => {
                get_subcategory(categoryItem);
            });
        }
    }, [category]);

    return (
        <div className="w-full m-8">
            
            {/* subcategory */}
            <Card className="m-2 overflow-auto h-80  ">
                <div className="flex gap-5 justify-between">
                    <h1 className="text-lg font-semibold">Subcategory</h1>
                    <Button label="Create" icon="pi pi-external-link" onClick={openDialogSubcategory} className="w-fit bg-blue-300 p-1.5 rounded-lg" />
                </div>
                {category.map((item, index) => (
                    <div key={`category-${index}`} className="px-4">
                        <h1 className="py-2 font-semibold ">{item.toUpperCase()}</h1>
                        {subcategory[item] && subcategory[item].map((subItem, subIndex) => (
                            <div key={`subcategory-${subIndex}`} className="mx-5">
                                <ul className="list-disc flex justify-between p-1">
                                    <li className="">{subItem}</li>
                                    <button className=' p-2 rounded-xl bg-blue-100' onClick={() => (index)}><TrashIcon className="h-5 w-5" /></button>
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}

            </Card>
            
            {/* dialog Subcatgory*/}
            <div className="">
                <Dialog className="bg-gray-200 p-3 w-96  rounded-lg" visible={openSubcategory} onHide={() => setOpenSubcategory(false)}>
                    <div className="grid *:my-2 ">
                        <h1 className="font-bold text-2xl ">Create Subacatgory</h1>
                        <form action="" onSubmit={handleCreateSubcategory} className="">
                            <select
                                name="category"
                                id=""
                                className="p-3 m-2 rounded-lg outline outline-2 outline-gray-500 w-80 "
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Select a category</option>
                                {category.map((item, index) => (
                                    <option value={item} key={index}>{item}</option>
                                ))}
                            </select>
                            <input
                                name="category"
                                type="text"
                                value={subcategoryName}
                                onChange={(e) => setSubcategoryname(e.target.value)}
                                placeholder="please input category"
                                label="subcategory"
                                className="w-80 p-2 m-2 rounded-lg outline outline-2 outline-gray-500"
                            />
                            <div className="flex justify-center w-82 bg-blue-300 rounded-lg p-2 m-2">
                                <button type="submit">Create</button>
                            </div>
                        </form>
                    </div>
                </Dialog>
            </div>
         
        </div >
    )

}