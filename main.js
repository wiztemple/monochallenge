/* eslint-disable prettier/prettier */
const modals = document.querySelectorAll('.modal');
const buttons = document.querySelectorAll('.button-click');
const cancelButtons = document.querySelectorAll('.close-modal');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
  const modal = [...modals].find(
      (modal) => modal.dataset.id === button.dataset.target,
    );
    modal.style.display = 'block';
  });
});

cancelButtons.forEach((cancelButton) => {
  cancelButton.addEventListener('click', () => {
    modals.forEach((modal) => {
      modal.style.display = 'none';
    });
  });
});
// dismiss modal when the window is clicked
document.addEventListener('click', (e) => {
  modals.forEach((modal) => {
    if (modal.style.display === 'block') {
      if (e.target.className === 'modal') {
        modal.style.display = 'none';
      }
    }
  });
});


const saveBtn = document.querySelector('.save-button');

saveBtn.addEventListener('click', () => {
  const userName = document.getElementById('userName').value;
  const userAmount = document.getElementById('userAmount').value;
  localStorage.setItem('username', userName);
  localStorage.setItem('userAmount', userAmount);
  modals.forEach((modal) => {
    modal.style.display = 'none';
  });
})
const connectButton = document.querySelector('.connect-button');
const dataId = '';
async function getData(url) {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'mono-sec-key': 'test_sk_Pv9nHAzqZi8BRsQYSkeA',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
  });
  const json = await response.json();
  return json; // parses JSON response into native JavaScript objects
}
connectButton.addEventListener('click', (event) => {
  const pk = 'test_pk_Cv8zpNgCtMtqiZoh4Ewg'; // your test public key
  const options = {
    onSuccess: (response) => {
      console.log(JSON.stringify(response.code));
      fetch('https://api.withmono.com/account/auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'mono-sec-key': 'test_sk_Pv9nHAzqZi8BRsQYSkeA',
        },
        body: JSON.stringify(response),
      })
        .then((data) => data.json())
        .then(async (data) => {
          
          console.log(data.id, 'data id')
          const debits =  await fetch(`https://api.withmono.com/accounts/${data.id}/debits`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'mono-sec-key': 'test_sk_Pv9nHAzqZi8BRsQYSkeA',
          },
        } )
        const debitsJson = await debits.json();
        console.log(debitsJson, 'debits json')
        const credits =  await fetch(`https://api.withmono.com/accounts/${data.id}/credits`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'mono-sec-key': 'test_sk_Pv9nHAzqZi8BRsQYSkeA',
          },
        } )
        const creditsJson = await credits.json();
        console.log(creditsJson, 'credits json')
        const userBalance =  await fetch(`https://api.withmono.com/accounts/${data.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'mono-sec-key': 'test_sk_Pv9nHAzqZi8BRsQYSkeA',
          },
        } )
        const userBalanceJson = await userBalance.json();
        console.log(userBalanceJson.balance, 'userbalance json')

        const avgCredit =  Number(creditsJson.total) / Number(creditsJson.history.length);
        console.log(avgCredit.toFixed(2), 'average credit')

        const avgDebit =  Number(debitsJson.total) / Number(debitsJson.history.length);
        console.log(avgDebit.toFixed(2), 'average debit')

        const payableAmount = (avgDebit / avgCredit ) * Number(userBalanceJson.balance);
        console.log(payableAmount.toFixed(2), 'payableAmount')
        const amountRequested = localStorage.getItem('userAmount');
        console.log(amountRequested, 'amount requested');
        if (payableAmount > Number(amountRequested)) {
          const creditModal = document.querySelector('.credit-modal');
          const msgText = 'Based on our calculation, you are eligible to borrow N'
           document.querySelector('.amountSpan').innerText = msgText + amountRequested.toString()
           creditModal.style.display = 'block';
        } else {
          const creditModal = document.querySelector('.credit-modal');
          const msgText = `Sorry, you can't borrow N${amountRequested.toString()}, however, you can borrow up to N${payableAmount}`
           document.querySelector('.amountSpan').innerText = msgText + amountRequested.toString()
           creditModal.style.display = 'block';
        }
        
        connect.close();
        });
        
       
    },
    onClose: () => {
      alert('user cancelled the authentication');
    },
  };
  
  const connect = new Connect(pk, options);
  connect.setup();
  connect.open();
});
// window.addEventListener('DOMContentLoaded', (event) => {
//   const pk = 'test_pk_Cv8zpNgCtMtqiZoh4Ewg'; // your test public key
//   const options = {
//     onSuccess: (response) => {
//       console.log(JSON.stringify(response.code));
//       fetch('https://api.withmono.com/account/auth', {
//         method: 'POST',
//         credentials: 'same-origin',
//         headers: {
//           'Content-Type': 'application/json;charset=utf-8',
//           'mono-sec-key': 'test_sk_Pv9nHAzqZi8BRsQYSkeA',
//         },
//         body: JSON.stringify(response),
//       })
//         .then((data) => data.json())
//         .then((data) => { connect.close() });
//       const fetchDebits = () => getData(`https://api.withmono.com/accounts/:${data.id}/debits`)
//       fetchDebits();
//     },
//     onClose: () => {
//       alert('user cancelled the authentication');
//     },
//   };
//   const connect = new Connect(pk, options);
//   connect.setup();
//   connect.open();
// });

