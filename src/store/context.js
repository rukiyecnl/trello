import { createContext, useContext } from "react";

export const TodoValues = createContext();

export default function UseTodoValues(){
    return useContext(TodoValues);
}