import React, { useCallback, useEffect, useReducer, useState } from 'react'

import Swal from 'sweetalert2'

const defaultState = {
  list: [],
  isEflagOpen: false,
}

const getList = () => {
  return localStorage.getItem('D_STATE')
    ? JSON.parse(localStorage.getItem('D_STATE'))
    : defaultState
}

const reducer = (state, action) => {
  try {
    const ACT = (type) => {
      return action.type === type
    }

    let concludeState

    if (ACT('SET_STATE')) {
      concludeState = action.payload
    }
    if (ACT('ADD_ITEM')) {
      concludeState = {
        ...state,
        list: [
          ...state.list,
          { name: action.payload, id: Date.now().toString() },
        ],
        isEflagOpen: false,
      }
    }
    if (ACT('REMOVE_ITEM')) {
      var newList = state.list.filter((item) => item.id !== action.payload)
      concludeState = {
        ...state,
        list: newList,
        isEflagOpen: false,
      }
    }
    if (ACT('EDITING_ITEM')) {
      concludeState = {
        ...state,
        isEflagOpen: true,
        idEdit: action.payload,
      }
    }
    if (ACT('EDIT_ITEM')) {
      var editedList = state.list.filter((item) => {
        if (item.id === state.idEdit) {
          item.name = action.payload
        }
        return item
      })
      delete state.idEdit
      concludeState = {
        ...state,
        list: editedList,
        isEflagOpen: false,
      }
    }

    localStorage.setItem('D_STATE', JSON.stringify(concludeState))
    return concludeState
  } catch (error) {
    throw new Error(`action.type ${action.type} does not exist`)
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState)
  const [name, setName] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const D_STATE = getList()
    dispatch({ type: 'SET_STATE', payload: D_STATE })
  }, [])

  useEffect(() => {
    const timeOutError = setTimeout(() => {
      setError(false)
    }, 1000)
    return () => {
      clearTimeout(timeOutError)
    }
  }, [error])

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
      setError(true)
      Swal.fire({
        title: 'Error!',
        text: 'Please add a value to the input ',
        icon: 'error',
        confirmButtonText: 'sure thing!',
      })
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
          style={error ? { outlineColor: 'red' } : null}
          value={name}
        />
        <button
          className='btn'
          type='submit'
          style={error ? { backgroundColor: 'red' } : null}
        >
          {state.isEflagOpen ? 'Edit Item' : 'Add Item'}
        </button>
      </form>
      <section className='section'>
        {state.list.map(({ name, id }, index) => {
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
