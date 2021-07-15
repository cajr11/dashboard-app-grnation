export const generateUsersMarkup = function (userInfo) {
  const markup = `
              <div class="user__list">
                  <ul class="user__list--content">
                  <li>${userInfo.id}</li>
                  <li>${userInfo.firstName}</li>
                  <li>${userInfo.lastName}</li>
                  <li>${userInfo.initials}</li>
                  <li>${userInfo.email}</li>
                  <li>${userInfo.created_at}</li>
                  </ul>
              </div> 
    `;
  return markup;
};
