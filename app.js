import('./src/main.js')
  .then((main) => {
    main.run()
  })
  .catch((error) => {
    console.error('Error loading module:', error)
  })
