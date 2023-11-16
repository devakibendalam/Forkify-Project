// the goal of helpers.js file is this module is to contain a couple of functions that we reuse over and over in our project.
// And so here in this module we then have a central place for all of them basically.

import { TIMEOUT_SEC } from "../config";
import {async} from 'regenerator-runtime';

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

 
export const AJAX = async function (url, uploadData = undefined) {
  try {
      const fetchPro = uploadData ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }) : fetch(url);

      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); 
      const data = await res.json();
    
      if (!res.ok) throw new Error(`${data.message} (${res.status})`);
      return data;
  } catch(err) {
      throw err;
  }
};


// export const getJSON = async function (url) {
//     try {
//         const fetchPro = fetch(url);
//         const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //added timeout functionality
//         const data = await res.json();
      
//         if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//         return data;
//     } catch(err) {
//         throw err; //throwing error to model.js file. this error is handing in that file
//     }
// };


// export const sendJSON = async function (url, uploadData) {
//   try {
//     // To send data to API use POST request
//       const fetchPro = fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         //payload request that is body
//         body: JSON.stringify(uploadData),
//       });

//       const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //added timeout functionality
//       const data = await res.json();
    
//       if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//       return data;
//   } catch(err) {
//       throw err; 
//   }
// };
