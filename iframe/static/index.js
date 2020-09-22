window.onload = function () {
  window.document
    .getElementById("btn")
    .addEventListener("click", async function onClick(e) {
      e.preventDefault();

      // Alternate way to set the form value object
      // const formValue = {};
      // Object.values(window.document.getElementsByTagName("input")).forEach((obj) => (formValue[obj.id] = obj.value));

      const formValue = Object.values(
        window.document.getElementsByTagName("input")
      ).reduce((obj, element) => {
        obj[element.id] = element.value;
        return obj;
      }, {});

      alert(JSON.stringify(formValue));

      const response = await messageTelChat(formValue);
      if (!response.ok)
        return alert("Failed to send message out to telegram chat");

      alert(JSON.stringify(response.result));
    });

  async function messageTelChat(formValue) {
    const sendMessageApiUrl = `https://api.telegram.org/bot${formValue.BOT_TOKEN}/sendMessage`;
    const chat_id = formValue.chat_id;

    delete formValue.BOT_TOKEN;
    delete formValue.chat_id;

    const res = await fetch(sendMessageApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id,
        text: JSON.stringify(formValue),
      }),
    });

    // Assumes JSON is received back and parse it before returning it to caller
    return res.json();
  }
};
