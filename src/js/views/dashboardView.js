//////////// Generate markup for latest tables ////////

export const generateLatestOrdersMarkup = function (order) {
  const markup = `
              <div class="order__info">
                  <ul class="order__info--list">
                      <li>${order.id}</li>
                      <li>${order.user_id}</li>
                      <li>${order.created_at}</li>
                  </ul>
              </div>
  `;
  return markup;
};

export const generateLatestProuctsMarkup = function (product) {
  const markup = `
          <div class="product__info">
              <ul class="product__info--list">
                  <li>${product.id}</li>
                  <li>${product.name}</li>
                  <li>${product.price}</li>
                  <li>${product.created_at}</li>
              </ul>
          </div>
      `;
  return markup;
};

export const generateLatestUsersMarkup = function (user) {
  const markup = `
              <div class="user__info">
                  <ul class="user__info--list">
                      <li>${user.id}</li>
                      <li>${user.firstName}</li>
                      <li>${user.lastName}</li>
                      <li>${user.initials}</li>
                      <li>${user.email}</li>
                      <li>${user.created_at}</li>
                  </ul>
              </div>
        `;
  return markup;
};
