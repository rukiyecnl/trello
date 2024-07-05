import { useEffect, useState } from "react";
import { TodoValues } from "./context"
import { supabase } from "../supabase/instance";

export const TodoProvider = ({children}) => {
    const [todos, setTodos] = useState([{}]);
    const [inProgress, setInProgress] = useState([{}]);
    const [done, setDone] = useState([{}]);

    useEffect(() => {
      getTodos();
      getInProgress();
      getDone();
    }, []);

    async function getTodos() {
      const { data } = await supabase.from("trelloTodos").select();
      setTodos(data);
    }

    async function getInProgress() {
      const { data } = await supabase.from("trelloInProgress").select();
      setInProgress(data);
    }

    async function getDone() {
      const { data } = await supabase.from("trelloDone").select();
      setDone(data);
    }
    // console.log(todos);
    return <TodoValues.Provider value={{todos , setTodos, inProgress, setInProgress, getTodos, done, setDone}}>{children}</TodoValues.Provider>
}