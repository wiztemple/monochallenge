window.addEventListener("DOMContentLoaded", (event) => {
  const pk = "test_pk_Cv8zpNgCtMtqiZoh4Ewg"; // your test public key
  const options = {
    onSuccess: (response) => {
      // console.log(JSON.stringify(response));
      postData("https://api.withmono.com/account/auth", response.code).then(
        (data) => {
          console.log(data, "data");
        },
      );
    },
    onClose: () => {
      alert("user cancelled the authentication");
    },
  };
  const connect = new Connect(pk, options);
  connect.setup();
  connect.open();
});

const baseUrl = `https://api.withmono.com`;

async function postData(url, data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "no-cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}
