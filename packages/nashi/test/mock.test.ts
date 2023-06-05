const files = import.meta.glob('/test/**/[a-zA-Z[]*.ts', {
  eager: true,
})

console.log(files)
