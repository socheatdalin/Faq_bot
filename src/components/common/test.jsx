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
    const navigate = useNavigate();
  
    // const get_category = async () => {
    //   try {
    //     const response = await axios.get("http://127.0.0.1:8000/find_category");
    //     setCategory(response.data);
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
  
    // const get_subcategory = async (categoryItem) => {
    //   try {
    //     const response = await axios.get(`http://127.0.0.1:8000/find_subcategory/${categoryItem}`);
    //     setSubcategory(prev => ({
    //       ...prev,
    //       [categoryItem]: response.data
    //     }));
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
  
    const handleClickItem = (subItem) => {
      setSelecteItem(subItem);
    };
  
    useEffect(() => {
      // get_category();
    }, []);
  
    // useEffect(() => {
    //   if (category.length > 0) {
    //     category.forEach(categoryItem => {
    //       get_subcategory(categoryItem);
    //     });
    //   }
    // }, [category]);
  
  
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <>
        <Card className="overflow-auto h-[700px] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
          <div>
            hello
          </div>
          {/* <div className="mb-2 p-4">
          <h1 className="flex justify-center font-bold text-xl">LIBRA BOT</h1>
          <Typography variant="h5" color="blue-gray" className="flex justify-center">
            <img src={logo} alt="" className="w-36 h-36" />
          </Typography>
        </div> */}
          <List>
            {/* <ListItem
            key="dashboard"
            className={`pl-8 gap-4 ${selecteItem === "dashboard" ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => handleClickItem("dashboard")}
          >
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Link to="/dashboard">Dashboard</Link>
          </ListItem> */}
            {/* <ListItem
            key="category"
            className={`pl-8 gap-4 ${selecteItem === "category" ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => handleClickItem("category")}
          >
            <ListItemPrefix>
              <Squares2X2Icon className="h-5 w-5" />
            </ListItemPrefix>
            <Link to="/category">Category && Subcategory</Link>
          </ListItem> */}
            {/* {category.map((item, index) => (
            <div key={`category-${index}`}>
              <h1 className="font-bold text-lg py-5">{item.toUpperCase()}</h1>
              {subCategory[item] && subCategory[item].map((subItem, subIndex) => (
                <ListItem
                  key={`subcategory-${subIndex}`}
                  className={`justify-center ${selecteItem === subItem ? 'bg-blue-500 text-white' : ''}`}
                  onClick={() => handleClickItem(subItem)}
                >
                  <Link to={`/${item}/${subItem}`}>{subItem}</Link>
                </ListItem>
              ))}
            </div>
          ))} */}
            <ListItem key="logout">
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              <div className="px-2 cursor-pointer" >Logout</div>
            </ListItem>
          </List>
        </Card>
      </>
    );
  }
  