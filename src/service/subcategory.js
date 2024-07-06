import axios, { Axios } from "axios"

const subcategoryService = {
    getSubCategory:async (categoryItem) =>{
        try{
            const res = await axios.get(`http://127.0.0.1:8000/find_subcategory/${categoryItem}`)
            return res.data
        }
        catch (error) {
            console.error('Error fetching subcategory:', error);
            throw error;
          }
    }, 

    getSubCategory_count:async() =>{            
        try{
            const count = await axios.get("http://127.0.0.1:8000/count-subcategory")
            return count.data
        }
        catch (error) {
            console.error('Error fetching subcategory:', error);
            throw error;
          }
    },

    create: async(categoryName, subcategoryName) =>{
        try{
            const create = await axios.post(`http://127.0.0.1:8000/categories/${categoryName}/subcategories/`,{subcategory_name: subcategoryName,})
            return create.data
        }
        catch (error) {
            console.error('Error fetching subcategory:', error);
            throw error;
          }
    },

    delete:async(categoryName,subcategoryName) =>{
        await axios.delete(`http://127.0.0.1:8000/categories/${categoryName}/subcategories/${subcategoryName}`)
    },

    update:async(category_name,currentSubcategory_name,subcategory_name) =>{
        const update = await axios.patch(`http://127.0.0.1:8000/${category_name}/${currentSubcategory_name}`,{
            header:{
                'Content-Type': 'application/json',
            }
        })
        return update.data
    }
}

export default subcategoryService;