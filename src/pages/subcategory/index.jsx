import React, { useEffect, useState } from "react"
import { Card } from '@mui/joy'
import axios from "axios";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import categoryService from "../../service/category";
import subcategoryService from "../../service/subcategory"

export default function Subcategory() {

    const [loading, setLoading] = useState([])
    const [category, setCategory] = useState([])
    const [openSubcategory, setOpenSubcategory] = useState(false);
    const [openUpdateSubcategory, setOpenUpdateSubcategory] = useState(false);
    const [subcategoryName, setSubcategoryname] = useState("");
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);
    const [subcategory, setSubcategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [newSubcategoryName, setNewSubcategoryName] = useState("")

    const navigate = useNavigate();

    const openDialogSubcategory = () => {
        setOpenSubcategory(true);
    };

    const closeDialogSubcategory = () => {
        setOpenSubcategory(false);
        setMessage('');
    };
    const openDialog = () => {
        setShow(true);
    };

    const closeDialog = () => {
        setShow(false);
    };
    const OpenUpdateSubcategory = () => {
        setOpenUpdateSubcategory(true);
    };

    const closeUpdateSubcategory = () => {
        setOpenUpdateSubcategory(false);
        setMessage('');
    };

    const get_category = async () => {
        try {
            const response = await categoryService.getCategory();
            setCategory(response);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const get_subcategory = async (categoryItem) => {
        try {
            const response = await subcategoryService.getSubCategory(categoryItem)
            setSubcategory(prev => ({
                ...prev,
                [categoryItem]: response
            }));
            console.log("sub", response)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    const handleCreateSubcategory = async (e) => {
        e.preventDefault();
        try {
            await subcategoryService.create(selectedCategory, subcategoryName)
            closeDialogSubcategory();
            get_category()
            get_subcategory()

        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.detail}`);
            } else {
                setMessage("An error occurred");
            }
        }
    }

    const handleDeleteSubcategory = async (categoryName, subcategoryName) => {
        try {
            await subcategoryService.delete(categoryName, subcategoryName)
            closeDialog();
            get_category();
            get_subcategory();
        }
        catch (error) {
            console.error('Error deleting items:', error);
        }
    }

    // const handleUpdateSubcategory = async () => {
    //     try {
    //         const response = await subcategoryService.update(selectedCategory, currentSubcategoryName, updatedSubcategory,)
    //     }
    //     catch (error) {
    //         console.error('Error update items:', error);
    //     }
    // }

    useEffect(() => {
        get_category()
    }, [])

    useEffect(() => {
        if (category.length > 0) {
            category.forEach(categoryItem => {
                get_subcategory(categoryItem);
            });
        }
    }, [category]);

    return (
        <div className="w-full h-fit ">
            <div className=" m-5 flex justify-end">
                <Button label="Create" icon="pi pi-external-link" onClick={openDialogSubcategory} className="w-fit bg-blue-300 p-1.5 rounded-lg" />
            </div>
            {/* subcategory */}
            <div className="m-2 bg-gray-100 p-2 rounded-xl h-[570px]">
                <div className="flex gap-5 justify-between">
                    <h1 className="text-lg font-semibold my-4">Subcategory</h1>
                </div>
                {category.map((item, index) => (
                    <div key={`category-${index}`} className="px-4">
                        <h1 className="py-2 font-semibold ">{item.toUpperCase()}</h1>
                        {subcategory[item] && subcategory[item].map((subItem, subIndex) => (
                            <div key={`subcategory-${subIndex}`} className="mx-5 px-5">
                                <ul className="list-disc flex justify-between p-1">
                                    <li className="">{subItem}</li>
                                    <div className="flex gap-2">
                                        <button className='text-red-700 ' onClick={OpenUpdateSubcategory}><PencilSquareIcon className="h-5 w-5" /></button>
                                        <button className='text-red-500' onClick={openDialog}><TrashIcon className="h-5 w-5" /></button>
                                    </div>

                                    <Dialog visible={show} onHide={() => setShow(false)} className="bg-gray-200 p-3 w-96  rounded-lg">
                                        <h1 className=" font-bold text-center text-xl text-red-600">Delete </h1>
                                        <p className=" text-center my-2">Are you sure you want to delete?</p>
                                        <div className="flex gap-5 justify-center my-3 *:bg-blue-200 *:p-2 *:rounded-lg">
                                            <button className="" onClick={closeDialog}>Cancel</button>
                                            <button onClick={() => handleDeleteSubcategory(item, subItem)}>Delete</button>
                                        </div>
                                    </Dialog>
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}

            </div>

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
                                onChange={(e) => setSubcategoryname(e.target.value.replace(/ /g, '_'))}
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
            </div >
            {/* EDIT */}
            < div className="" >
                <Dialog className="bg-gray-200 p-3 w-96  rounded-lg" visible={openUpdateSubcategory} onHide={() => setOpenUpdateSubcategory(false)}>
                    <div className="grid *:my-2 ">
                        <h1 className="font-bold text-2xl ">Update Subacatgory</h1>
                        <form action="" onSubmit={handleCreateSubcategory} className="">
                            {/* <select
                                name="category"
                                id=""
                                className="p-3 m-2 rounded-lg outline outline-2 outline-gray-500 w-80 "
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Select a category</option>
                                {category.map((item, index) => (
                                    <option value={item} key={index}>{item}</option>
                                ))}
                            </select> */}
                            <input
                                name="category"
                                type="text"
                                value={newSubcategoryName}
                                onChange={(e) => setNewSubcategoryName(e.target.value)}
                                placeholder="please input category"
                                label="subcategory"
                                className="w-80 p-2 m-2 rounded-lg outline outline-2 outline-gray-500"
                            />
                            <div className="flex justify-center w-82 bg-blue-300 rounded-lg p-2 m-2">
                                <button type="submit">Update</button>
                            </div>
                        </form>
                    </div>
                </Dialog>
            </ div>
        </div >
    )

}