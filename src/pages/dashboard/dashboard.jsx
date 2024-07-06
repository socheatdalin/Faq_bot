import React, { useEffect, useState } from "react"
import { Card } from '@mui/joy'
import axios from "axios";
import { QuestionMarkCircleIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import categoryService from "../../service/category";
import subcategoryService from "../../service/subcategory";

export default function Dashboard() {

  const [loading, setLoading] = useState([])
  const [show, setShow] = useState(false);
  const [categoryCount, setCategoryCount] = useState(null);
  const [subcategoryCount, setSubategoryCount] = useState(null);
  const [category, setCategory] = useState([])
  const [subcategory, setSubcategory] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('');


  const get_category_count = async () => {
    try {
      const response = await categoryService.getCategoryCount()
      setCategoryCount(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const get_subcategory_count = async () => {
    try {
      const res = subcategoryService.getSubCategory_count()
      setSubategoryCount(res);

    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  }

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


  useEffect(() => {
    get_category_count()
    get_category()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      get_subcategory(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <div className="w-full mr-10 h-[580px]">
      <div className="w-full h-fit m-8" >
        <div className="flex justify-between ">
          <Card className="m-5 w-56">
            <h1 className="text-lg font-semibold">Category</h1>
            <div className="flex gap-5 ">
              <Squares2X2Icon className="h-10 w-10 mt-2" />
              <div className=" text-[36px] font-bold">{categoryCount}</div>
            </div>
          </Card>
          <Card className="m-5  w-56">
            <h1 className="text-lg font-semibold">Subcategory</h1>
            <div className="flex gap-5">
              <Squares2X2Icon className="h-10 w-10 mt-2" />
              <div className=" text-[36px] font-bold">{subcategoryCount}</div>
            </div>
          </Card>
          <Card className="m-5  w-56">
            <h1 className="text-lg font-semibold">Question</h1>
            <div className="flex gap-5">
              <QuestionMarkCircleIcon className="h-12 w-12 mt-2 " />
              <div className=" text-[36px] font-bold"></div>
            </div>
          </Card>
        </div>
        <div className=" grid justify-items-start place-content-start my-12 m-5 rounded-xl bg-gray-100 w-fit">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar />
          </LocalizationProvider>
        </div>
      </div>

    </div>
  )

}