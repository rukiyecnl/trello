import { useEffect, useState } from 'react'
import './App.css'
import { Header } from './components/Header'
import UseTodoValues from './store/context'
import { supabase } from './supabase/instance'
import { DeleteFromSupabase } from './helper/DeleteFunction'

function App() {
  const {todos, setTodos, inProgress, setInProgress, getTodos, done, setDone} = UseTodoValues();
  const [isCardAdd, SetIsCard] = useState(true);
  const [isCardAdd2, SetIsCard2] = useState(true);
  const [isCardAdd3, SetIsCard3] = useState(true);
  const [todoTitle, setTodoTitle] = useState(" ");

  const handleCardAddBtn = async (tableName) => {
     
    const { data, error } = await supabase
    .from(tableName)
    .insert({ todo: todoTitle})
    .select();

    if (tableName == "trelloTodos")
      {
        setTodos([...todos, ...data]);
        SetIsCard(true)
      } 
    else if (tableName == "trelloInProgress"){
        setInProgress([...inProgress, ...data]);
        SetIsCard2(true);
    } 
    else if (tableName == "trelloDone"){
      setDone([...done, ...data]);
      SetIsCard3(true);
  } 
  }

  const handleAddInProgress = async (todoId) => {
    const chosedTodo = todos.find(todo => todo.id === todoId);

    const {data} = await supabase
    .from("trelloInProgress")
    .insert({todo: chosedTodo.todo})
    .select();

    setInProgress([...inProgress, ...data]);

    await DeleteFromSupabase("trelloTodos", todoId);
    // const { error } = await supabase
    // .from('trelloTodos')
    // .delete()
    // .eq( "id", todoId );

    // todos.map(todo => todo.id == todoId ? {...todo, isBeing: !todo.isBeing} : todo);

    setTodos(todos.filter(todo => todo.id !== todoId));
    
    // getTodos();
        
  }

  const handleAddDone = async (todoId) => {
    const chosedTodo = inProgress.find(todo => todo.id === todoId);

    const {data} = await supabase
    .from("trelloDone")
    .insert({todo: chosedTodo.todo})
    .select();

    setDone([...done, ...data]);

    await DeleteFromSupabase("trelloInProgress", todoId);
    // const { error } = await supabase
    // .from('trelloTodos')
    // .delete()
    // .eq( "id", todoId );

    // todos.map(todo => todo.id == todoId ? {...todo, isBeing: !todo.isBeing} : todo);

    setInProgress(inProgress.filter(todo => todo.id !== todoId));
    

  }

  const handleDeleteTodo = (tableName, todoId) => {
    DeleteFromSupabase(tableName, todoId);
    setTodos(todos.filter(todo => todo.id !== todoId));
    setInProgress(inProgress.filter(todo => todo.id !== todoId));
    setDone(done.filter(todo => todo.id !== todoId));
  }


  console.log(todos);

  return (
    <>
      <Header />
      <div className="container">
        <div className="main-content">
          <div className="todos card">

            <div className="todo-header card-header">
              <p>Yapılacaklar</p>
              <a href="#">...</a>
            </div>

            <ul className="todo-karts card-list">
                {todos.map((todo,index) => {
                  return(
                    <li key={index} className='list-item todo-item'>
                      <p>{todo.todo}</p>
                      <button onClick={() => handleAddInProgress(todo.id)}>Yapılıyora ekle</button>
                      <button onClick={() => handleDeleteTodo("trelloTodos",todo.id)}>🗑️</button>
                    </li>
                  )
                })}
            </ul>
            {isCardAdd 
            ? 
              (<button className='add-card' onClick={() => SetIsCard(false)}>Kart ekle</button>) 
            : 
              (
                <div>
                  <input type="text" placeholder='boş' onChange={(e) => setTodoTitle(e.target.value)}/>
                  <button className='add-card' onClick={() => handleCardAddBtn("trelloTodos")}>Kart ekle</button>
                </div>

              )}
            
          </div>

          <div className="in-progress card">
              <div className="in-progress-header card-header">
                <p>Yapılıyor</p>
                <a href="#">...</a>
              </div>

              <ul className="in-progress-karts card-list">
                  {inProgress.map((todo,index) => {
                    return(
                      <li key={index} className='list-item progress-item'>
                        <p>{todo.todo}</p>
                        <button onClick={() => handleAddDone(todo.id)}>Bitir</button>
                        <button onClick={() => handleDeleteTodo("trelloInProgress",todo.id)}>🗑️</button>
                      </li>
                    )
                  })}
              </ul>
              {isCardAdd2 
              ? 
                (<button className='add-card' onClick={() => SetIsCard2(false)}>Kart ekle</button>) 
              : 
                (
                  <div>
                    <input type="text" placeholder='boş' onChange={(e) => setTodoTitle(e.target.value)}/>
                    <button className='add-card' onClick={() => handleCardAddBtn("trelloInProgress")}>Kart ekle</button>
                  </div>

                )}

          </div>

          <div className="done card">
              <div className="done-header card-header">
                <p>Bitti</p>
                <a href="#">...</a>
              </div>

              <ul className="done-karts card-list">
                  {done.map((todo,index) => {
                    return(
                      <li key={index} className='list-item done-item'>
                        <p>{todo.todo}</p>
                        <button onClick={() => handleDeleteTodo("trelloDone",todo.id)}>🗑️</button>
                      </li>
                    )
                  })}
              </ul>
              {isCardAdd3
              ? 
                (<button className='add-card' onClick={() => SetIsCard3(false)}>Kart ekle</button>) 
              : 
                (
                  <div>
                    <input type="text" placeholder='boş' onChange={(e) => setTodoTitle(e.target.value)}/>
                    <button className='add-card' onClick={() => handleCardAddBtn("trelloDone")}>Kart ekle</button>
                  </div>

                )}

          </div>

        </div>

      </div>
    </>
  )
}

export default App
