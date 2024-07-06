import axios, { Axios } from "axios"

const categoryService = {
    getCategory:async () =>{
        try{
            const res = await axios.get(`http://127.0.0.1:8000/find_category`)
            return res.data
        }
        catch (error) {
            console.error('Error fetching category:', error);
            throw error;
          }
    },

    getCategoryCount:async() =>{
        try{
            const count = await axios.get("http://127.0.0.1:8000/count-category")
            return count.data
        }
        catch (error) {
            console.error('Error fetching category:', error);
            throw error;
          }
    },
    create:async(categoryName) =>{
        try{
            const createCategory = await axios.post("http://127.0.0.1:8000/categories/",{ category_name: categoryName })
            return createCategory.data
        }
        catch (error) {
            console.error('Error fetching category:', error);
            throw error;
          }
        
    },
    deleteCategory :async(categoryName) =>{
        try{
            await axios.delete(`http://127.0.0.1:8000/category/${categoryName}`)
            
        }
        catch (error) {
            console.error('Error fetching category:', error);
            throw error;
          }
    },

    update:async(category_name, newCategoryName) =>{
        try{
             const response = await axios.patch(`http://127.0.0.1:8000/category/${category_name}`,newCategoryName) 
            return response.data;
        }
        catch (error) {
            console.error('Error updating category', error);
            throw error;
        }
    
    }
}

export default categoryService;