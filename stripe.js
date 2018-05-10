var checkoutHandler = StripeCheckout.configure({
  key: "pk_test_edJT25Bz1YVCJKIMvmBGCS5Y",
  locale: "auto"
});

//handle credit card transfers
var buttonCard = document.getElementById("buttonCheckoutwithCard");

buttonCard.addEventListener("click", function(ev) {
  checkoutHandler.open({
    name: "132 Chapel St. LLC",
    description: "Rent Payment",
    token: handleTokenCard
  });
});

function handleTokenCard(token) {
  fetch("/charge/card", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(token)
  })
  .then(output => {
    if (output.status === "succeeded")
      document.getElementById("shop").innerHTML = "<p>Purchase complete!</p>";
  })
}
