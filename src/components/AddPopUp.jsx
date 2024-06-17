import { IconButtonRoot } from "@mui/joy/IconButton/IconButton";
import { useState } from "react";

export default function AddPopup({ onClose }) {
        const [question, setQuestion] = useState()
        const [answer, setAnswer] = useState()
        const [type, setType] = useState()

        return (
                <div className="w-fit border m-auto p-5 bg-white rounded-xl shadow-md">
                        <div className="flex justify-between">

                                <h1 className="text-xl font-bold my-3">Add Question</h1>
                                <button className="close-btn" onClick={onClose}> x </button>
                        </div>

                        <div className="">
                                <div className="block my-3">
                                        <label htmlFor="question">Question</label><br />
                                        <input type="text" placeholder="please input question" className="border p-1 rounded-xl w-80 px-3 hover:border-3 hover:border-blue-400 focus:border-blue-400 focus:ring-2 focus:outline-none" />
                                </div>
                                <div className="block my-3">
                                        <label htmlFor="answer">Answer</label><br />
                                        <input type="text" placeholder="please input the answer" className="border p-1 rounded-xl w-80 px-3 hover:border-3 hover:border-blue-400 focus:border-blue-400 focus:ring-2 focus:outline-none" />
                                </div>
                                <div className="block my-3">
                                        <label htmlFor="type">Answer</label><br />
                                        <input type="text" placeholder="please input the type" className="border p-1 rounded-xl w-80 px-3 hover:border-3 hover:border-blue-400 focus:border-blue-400 focus:ring-2 focus:outline-none" />
                                </div>
                                <div className="block my-3">
                                        <label htmlFor="image">Image</label><br />
                                        <input type="file" />
                                </div>
                                <button className="bg-blue-400 p-2 rounded-xl w-full ">Submit</button>
                        </div>
                </div>
        )
}