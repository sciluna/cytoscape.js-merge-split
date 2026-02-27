let helper = {};

/**
 * multiply an array with centering matrix
 * array and result are 1d arrays
 */
helper.multGamma = function(array){
  let result = [];
  let sum = 0;

  for(let i = 0; i < array.length; i++){
    sum += array[i];
  }

  sum *= (-1)/array.length;

  for(let i = 0; i < array.length; i++){
    result[i] = sum + array[i];
  }     
  return result;
};

/**
 * matrix multiplication
 * array1, array2 and result are 2d arrays
 */
helper.multMat = function(array1, array2){
  let result = [];

  for(let i = 0; i < array1.length; i++){
      result[i] = [];
      for(let j = 0; j < array2[0].length; j++){
        result[i][j] = 0;
        for(let k = 0; k < array1[0].length; k++){
          result[i][j] += array1[i][k] * array2[k][j]; 
        }
      }
    } 
  return result;
};

/**
 * matrix transpose
 * array and result are 2d arrays
 */
helper.transpose = function(array){
  let result = [];
  
  for(let i = 0; i < array[0].length; i++){
    result[i] = [];
    for(let j = 0; j < array.length; j++){
      result[i][j] = array[j][i];
    }
  }
  
  return result;
};

/**
 * dot product of two arrays with same size
 * array1 and array2 are 1d arrays
 */
helper.dotProduct = function(array1, array2){
  let product = 0;

  for(let i = 0; i < array1.length; i++){
    product += array1[i] * array2[i]; 
  }

  return product;
};

export default helper;