module.exports = () => {
  /* using JSON string/parse for deep cloning. Array.slice(0) doesn't 
  seem to play well. It ends up linking */
  const dim1 = [];
  for (let i = 0; i < 64; i++)
    dim1.push(0);

  const dim2 = dim1.slice();
  for (let i = 0; i < 64; i++)
    dim2[i] = JSON.parse(JSON.stringify(dim1));

  const dim3 = dim2.slice();
  for (let i = 0; i < 64; i++)
    dim3[i] = JSON.parse(JSON.stringify(dim2));

  return dim3;
}