export const generateOrdersMarkup = function (orderData, itemsList) {
  const markup = `
        <div class="order__list">
            <ul class="order__list--content">
                <li>${orderData.userID}</li>
                <li>${orderData.firstName}</li>
                <li>${orderData.lastName}</li>
                <li class="bought__list">${itemsList
                  .map((item) => `<span>${item}</span>`)
                  .join("")}</li>
                <li>${orderData.email}</li>
                <li>$${orderData.total}</li>
            </ul>
        </div>
            `;
  return markup;
};
