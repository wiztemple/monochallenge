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
const financial = (x) => Number.parseFloat(x).toFixed(0);
const localize = (num) => Number(num).toLocaleString();

connectButton.addEventListener('click', (e) => {
  const pk = 'test_pk_Cv8zpNgCtMtqiZoh4Ewg'; // your test public key
  const options = {
    onSuccess: (response) => {
      // console.log(JSON.stringify(response.code));
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
          const debits =  await fetch(`https://api.withmono.com/accounts/${data.id}/debits`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'mono-sec-key': 'test_sk_Pv9nHAzqZi8BRsQYSkeA',
          },
        } )
        const debitsJson = await debits.json();
        // console.log(debitsJson, 'debits json')
        const credits =  await fetch(`https://api.withmono.com/accounts/${data.id}/credits`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'mono-sec-key': 'test_sk_Pv9nHAzqZi8BRsQYSkeA',
          },
        } )
        const creditsJson = await credits.json();
        // console.log(creditsJson, 'credits json')
        const userBalance =  await fetch(`https://api.withmono.com/accounts/${data.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'mono-sec-key': 'test_sk_Pv9nHAzqZi8BRsQYSkeA',
          },
        } )
        const userBalanceJson = await userBalance.json();
        const avgCredit =  Number(creditsJson.total) / Number(creditsJson.history.length);
        const avgDebit =  Number(debitsJson.total) / Number(debitsJson.history.length);
        const payableAmount = (avgDebit / avgCredit ) * Number(userBalanceJson.balance);
        const amountRequested = localStorage.getItem('userAmount');
        if (payableAmount > Number(amountRequested)) {
          const creditModal = document.querySelector('.credit-modal');
          document.querySelector('.loaner').innerHTML = localStorage.getItem('username');
          const msgText = 'Based on our calculation, you are eligible to borrow N'
           document.querySelector('.amountSpan').innerHTML = msgText + localize(amountRequested)
           creditModal.style.display = 'block';
        } else {
          const creditModal = document.querySelector('.credit-modal');
          document.querySelector('.loaner').innerHTML = localStorage.getItem('username');
          const msgText = `Sorry, you can't borrow N${localize(amountRequested)}, however, you can borrow up to N${localize(payableAmount) || 0}`
           document.querySelector('.amountSpan').innerHTML = msgText + localize(amountRequested)
           creditModal.style.display = 'block';
        }
        connect.close();
        });
    },
    onClose: () => console.log('connection closed')
    
  };
  const connect = new Connect(pk, options);
  connect.setup();
  connect.open();
});


