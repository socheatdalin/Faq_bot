import React, { useEffect, useState } from "react"
import { Flex, Box, Card, Typography } from '@mui/joy'
import { List, ListItem } from "@material-tailwind/react";
import axios from "axios";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import categoryService from "../../service/category";

export default function Category() {

    const [loading, setLoading] = useState([])
    const [category, setCategory] = useState([])
    const [openCategory, setopenCategory] = useState(false);
    const [openUpdateCategory, setOpenUpdateCategory] = useState(false);
    const [show, setShow] = useState(false);
    const [categoryName, setCategoryname] = useState("");
    const [newCategoryName, setNewCategoryName] = useState('')
    const [selectCategory, setSelectCategory] = useState('')
    const [response, setResponse] = useState(null);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const openDialog = () => {
        setShow(true);
    };

    const closeDialog = () => {
        setShow(false);
    };
    const OpenUpdateCategory = () => {
        setOpenUpdateCategory(true);
    };

    const closeUpdateCategory = () => {
        setOpenUpdateCategory(false);
        setMessage('');
    };
    const openDialogCategory = () => {
        setopenCategory(true);
    };

    const closeDialogCategory = () => {
        setopenCategory(false);
        setMessage('');
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await categoryService.create(categoryName)
            setCategoryname('')
            get_category()
            closeDialogCategory();
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.detail}`);
            } else {
                setMessage("An error occurred");
            }
        }
    }


    const handleDelete = async (category_name) => {
        try {
            await categoryService.deleteCategory(category_name)
            closeDialog()
            get_category()

        } catch (error) {
            console.error('Error deleting items:', error);
        }

    };

    const handleClickUpdate = (category) => {
        setSelectCategory(category)
        setNewCategoryName(category)
        setOpenUpdateCategory(true);
    }

    const handleUpdateCategory = async (e) => {
        e.preventDefault();

        try {
            const category = { category_name: newCategoryName }
            const response = await categoryService.update(selectCategory, category);
            setMessage(response.message);
            closeUpdateCategory()
            get_category()
            // console.log("Category updated:", updatedCategory);
        } catch (error) {
            console.error("Error updating category:", error.message);
        }
    }

    useEffect(() => {
        get_category()

    }, [])

    return (
        <div className="w-full  ">
            {/* category */}
            <div className=" m-5 flex justify-end">
                <Button label="Create category" icon="pi pi-external-link" onClick={openDialogCategory} className="w-fit bg-blue-300 p-1.5 rounded-lg" />
            </div>
            <div className="m-2 bg-gray-100 p-2 rounded-xl h-[570px] px-5">
                <div className="flex gap-5 justify-between my-3">
                    <h1 className="text-lg font-semibold">Category</h1>
                </div>
                <div className="">
                    {category.map((item, index) => (
                        <div className=" flex justify-between py-1 ">
                            <ul className=" list-disc mx-12" key={item}>
                                <li >{item}</li>
                            </ul>
                            <div className="flex gap-2">
                                <button className='text-red-700 ' onClick={() => handleClickUpdate(item)}><PencilSquareIcon className="h-5 w-5" /></button>
                                <button className='text-red-500' onClick={openDialog}><TrashIcon className="h-5 w-5" /></button>
                            </div>
                            {/* delete */}
                            <Dialog visible={show} onHide={() => setShow(false)} className="bg-gray-200 p-3 w-96  rounded-lg">
                                <h1 className=" font-bold text-center text-xl text-red-600">Delete </h1>
                                <p className=" text-center my-2">Are you sure you want to delete?</p>
                                <div className="flex gap-5 justify-center my-3 *:bg-blue-200 *:p-2 *:rounded-lg">
                                    <button className="" onClick={closeDialog}>Cancel</button>
                                    <button onClick={() => handleDelete(item)}>Delete</button>
                                </div>
                            </Dialog>
                            {/* edit */}

                        </div>
                    ))}
                </div>
            </div>

            {/* dialog catgory*/}
            <div className="">
                <Dialog className="bg-gray-200 p-3 w-96  rounded-lg" visible={openCategory} onHide={() => setopenCategory(false)}>
                    <div className="grid *:my-2 ">
                        <h1 className="font-bold text-2xl ">Create Catgeory</h1>
                        <form action="" onSubmit={handleSubmit} className="">
                            <input
                                name="category"
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryname(e.target.value.replace(/ /g, '_'))}
                                placeholder="please input category"
                                label="category"
                                className="w-80 p-2 m-2 rounded-lg outline outline-2 outline-gray-500"
                            />
                            <div className="flex justify-center w-82 bg-blue-300 rounded-lg p-2 m-2">
                                <button type="submit">Create</button>
                            </div>
                        </form>
                    </div>
                </Dialog>
            </div>

            {/* edit */}

            <div className="">
                <Dialog className="bg-gray-200 p-3 w-96  rounded-lg" visible={openUpdateCategory} onHide={() => setOpenUpdateCategory(false)}>
                    <div className="grid *:my-2 ">
                        <h1 className="font-bold text-2xl ">Update Catgeory</h1>
                        <form action="" onSubmit={handleUpdateCategory} className="">
                            <input
                                name="category"
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="please input category"
                                label="category"
                                className="w-80 p-2 m-2 rounded-lg outline outline-2 outline-gray-500"
                            />
                            <div className="flex justify-center w-82 bg-blue-300 rounded-lg p-2 m-2">
                                <button type="submit">Update</button>
                            </div>
                        </form>
                    </div>
                </Dialog>
            </div>
        </div >
    )

}