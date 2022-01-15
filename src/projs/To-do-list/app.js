import React, { useCallback, useState, useEffect } from 'react'

const App = () => {
  const [name, setName] = useState('')
  const [list, setList] = useState([])
  const [eFlag, setEflag] = useState({ edit: false, id: '' })

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault()
      if (name && !eFlag.edit) {
        setList([...list, { name, id: Date.now().toString() }])
        setName('')
        return
      }

      if (name && eFlag.edit) {
        const newList = list.filter((item) => {
          if (item.id === eFlag.id) {
            item.name = name
            item.id = Date.now().toString()
          }
          return item
        })
        setName('')
        setList([...newList])
        setEflag({ edit: false, id: '' })
        return
      }
      alert('Please enter a value')
    },
    [name]
  )

  const removeItem = useCallback(
    (id) => {
      setList((list) => list.filter((item) => item.id !== id))
    },
    [list]
  )

  const editItem = useCallback(
    (id) => {
      const item = list.find((item) => item.id === id)
      setName(item.name)
    },
    [list]
  )
  useEffect(() => {
    console.log('list')
  }, [list])

  return (
    <div className='container'>
      <form className='form' onSubmit={submitHandler}>
        <input
          type='text'
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <button className='btn'>{eFlag.edit ? 'Edit Item' : 'Add Item'}</button>
      </form>
      <section className='section'>
        {list.map(({ name, id }) => {
          return (
            <article className='item' key={id}>
              <h4>{name}</h4>
              <button type='button' onClick={(e) => removeItem(id)}>
                remove
              </button>
              <button
                type='button'
                onClick={(e) => {
                  editItem(id)
                  setEflag({ edit: true, id })
                }}
              >
                edit
              </button>
            </article>
          )
        })}
      </section>
    </div>
  )
}

export default App
