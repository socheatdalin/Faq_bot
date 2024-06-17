import React, { useEffect, useState } from "react"
import { Card } from '@mui/joy'
import axios from "axios";
import { QuestionMarkCircleIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/common/sidebar";

export default function Dashboard() {

  const [loading, setLoading] = useState([])
  const [category, setCategory] = useState([])
  const [selecteItem, setSelecteItem] = useState(null);
  const [subCategory, setSubcategory] = useState([])
  const [categoryCount, setCategoryCount] = useState(null);
  const [visible, setVisible] = useState(false);
  const [response, setResponse] = useState(null);
  const [categoryName, setCategorynmae] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/categories/', {
        category_name: categoryName,
      });
      setMessage(`Category created successfully with ID: ${response.data._id}`);
      setVisible(false);
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.detail}`);
      } else {
        setMessage("An error occurred");
      }
    }
  }

  useEffect(() => {
    get_category()
    get_category_count()
    // handleSubmit()
  }, [])

  return (
    <>
      {/* <Sidebar /> */}
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
              <div className=" text-[36px] font-bold">{categoryCount}</div>
            </div>
          </Card>
          <Card className="m-5  w-56">
            <h1 className="text-lg font-semibold">Question</h1>
            <div className="flex gap-5">
              <QuestionMarkCircleIcon className="h-12 w-12 mt-2 " />
              <div className=" text-[36px] font-bold">{categoryCount}</div>
            </div>
          </Card>
        </div>
        <div className=" grid justify-items-start place-content-start my-12 m-5 rounded-xl bg-gray-100 w-fit">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar />
          </LocalizationProvider>
        </div>
      </div>
    </>
  )

}