import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  PowerIcon,
  Squares2X2Icon
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/robot1.png"

export default function Sidebar() {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [selecteItem, setSelecteItem] = useState(null);
  const [subCategory, setSubcategory] = useState({});

  const handleClickItem = (subItem) => {
    setSelecteItem(subItem);
  };
  const get_category = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/find_category");
      setCategory(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const get_subcategory = async (categoryItem) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/find_subcategory/${categoryItem}`);
      setSubcategory(prev => ({
        ...prev,
        [categoryItem]: response.data
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    get_category();
  }, []);
  useEffect(() => {
    if (category.length > 0) {
      category.forEach(categoryItem => {
        get_subcategory(categoryItem);
      });
    }
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="h-[700px] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-auto">
        <div>
          <h1 className="flex justify-center font-bold text-xl">LIBRA BOT</h1>
          <div className="flex justify-center">
            <img src={logo} alt="" className="w-36 h-36" />
          </div>
        </div>
        <div className={`pl-8 my-4 gap-4 p-2 rounded-lg ${selecteItem === "dashboard" ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => handleClickItem("dashboard")}>
          <div className="flex gap-5">
            <PresentationChartBarIcon className="h-5 w-5" />
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>

        <div className={`pl-8 gap-4 p-2 rounded-lg ${selecteItem === "category" ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => handleClickItem("category")} >
          <div className="flex gap-5">
            <Squares2X2Icon className="h-5 w-5" />
            <Link to="/category">Category && Subcategory</Link>
          </div>
        </div>

        {category.map((item, index) => (
          <div key={`category-${index}`}>
            <h1 className="font-bold text-lg py-5">{item.toUpperCase()}</h1>
            {subCategory[item] && subCategory[item].map((subItem, subIndex) => (
              <div className="flex justify-center w-full my-2" key={`subCategory-${subIndex}`}>
                <Link
                  to={`/${item}/${subItem}`}
                  className={`${selecteItem === subItem ? 'bg-blue-500 p-1 flex justify-center items-center rounded-lg w-24 text-white' : ''}`}
                  onClick={() => handleClickItem(subItem)}
                >
                  {subItem}
                </Link>
              </div>
            ))}
          </div>
        ))}

        <div >

          <div className="px-2 cursor-pointer flex  gap-4"  >
            <PowerIcon className="h-5 w-5" />
            <h1 className="font-bold">Logout</h1>
          </div>
        </div>

      </div >
    </>
  );
}
