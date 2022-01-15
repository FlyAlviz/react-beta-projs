import React, { useCallback, useEffect, useReducer, useState } from 'react'
const defaultState = {
  list: [],
  isEflagOpen: false,
}
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        list: [
          ...state.list,
          { name: action.payload, id: Date.now().toString() },
        ],
        isEflagOpen: false,
      }
    case 'REMOVE_ITEM':
      var newList = state.list.filter((item) => item.id !== action.payload)
      return {
        ...state,
        list: newList,
        isEflagOpen: false,
      }
    case 'EDITING_ITEM':
      return {
        ...state,
        isEflagOpen: true,
        idEdit: action.payload,
      }
    case 'EDIT_ITEM':
      var editedList = state.list.filter((item) => {
        if (item.id === state.idEdit) {
          item.name = action.payload
        }
        return item
      })
      delete state.idEdit
      return {
        ...state,
        list: editedList,
        isEflagOpen: false,
      }
    default:
      throw new Error(`action.type ${action.type} does not exist`)
  }
}
const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState)
  const [name, setName] = useState('')

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault()
      if (name && !state.isEflagOpen) {
        dispatch({ type: 'ADD_ITEM', payload: name })
        setName('')
        return
      }
      if (name && state.isEflagOpen) {
        dispatch({ type: 'EDIT_ITEM', payload: name })

        setName('')
        return
      }
      alert('Please add a value')
    },
    [name]
  )

  const removeItem = useCallback(
    (id) => {
      dispatch({ type: 'REMOVE_ITEM', payload: id })
    },
    [state]
  )

  const editItem = useCallback(
    (id) => {
      dispatch({ type: 'EDITING_ITEM', payload: id })
      setName('')
    },
    [state]
  )
  return (
    <div className='container'>
      <form className='form' onSubmit={submitHandler}>
        <input
          type='text'
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
          value={name}
        />
        <button className='btn' type='submit'>
          {state.isEflagOpen ? 'Edit Item' : 'Add Item'}
        </button>
      </form>
      <section className='section'>
        {state.list.map(({ name, id }) => {
          const selected = state.idEdit === id
          return (
            <article className='product' key={id}>
              <h4>{name}</h4>
              <div>
                <button className='btn' onClick={() => removeItem(id)}>
                  remove
                </button>
                <button
                  className='btn'
                  type='button'
                  onClick={() => editItem(id)}
                  style={{
                    backgroundColor:
                      state.isEflagOpen && selected ? 'black' : '',
                  }}
                >
                  edit
                </button>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

export default App
