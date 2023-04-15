const changeDevice = (device) => {
  const body = document.querySelector("body");
  const idDevice = device.id === "pc" ? "phone" : "pc";

  device.classList.add("hidden");
  document.querySelector(`#${idDevice}`).classList.remove("hidden");

  if (device.id === "pc") {
    body.classList.remove("mobile");
    body.classList.add("desktop");
  } else {
    body.classList.add("mobile");
    body.classList.remove("desktop");
  }
};
