export const generateProductMarkup = function (productInfo) {
  const markup = `
        <div class="product__list">
            <ul class="product__list--content">
                <li>${productInfo.id}</li>
                <li>${productInfo.name}</li>
                <li>${productInfo.price}</li>
                <li>${productInfo.created_at}</li>
            </ul>
        </div>
`;
  return markup;
};
