describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.get('[data-testid="constructor-bun-top"]').should(
        'contain',
        'Краторная булка N-200i'
      );
      cy.get('[data-testid="constructor-bun-bottom"]').should(
        'contain',
        'Краторная булка N-200i'
      );
    });

    it('должен добавить начинку в конструктор', () => {
      cy.contains('Говяжий метеорит (отбивная)')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      cy.get('[data-testid="constructor-ingredients"]').should(
        'contain',
        'Говяжий метеорит (отбивная)'
      );
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открываться при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal"]').should('contain', 'Краторная булка N-200i');
    });

    it('должно отображать данные именно того ингредиента, по которому был клик', () => {
      cy.contains('Говяжий метеорит (отбивная)').click();

      cy.get('[data-testid="modal"]').should('contain', 'Говяжий метеорит (отбивная)');
      cy.get('[data-testid="modal"]').should('not.contain', 'Краторная булка N-200i');
    });

    it('должно закрываться по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid="modal"]').should('be.visible');

      cy.get('[data-testid="modal-close"]').click();

      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должно закрываться по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid="modal"]').should('be.visible');

      cy.get('[data-testid="modal-overlay"]').click({ force: true });

      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/auth/user', {
        body: { success: true, user: { email: 'test@test.com', name: 'Test' } }
      }).as('getUser');
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

      // Подставляем токены ДО визита на страницу
      cy.setCookie('accessToken', 'Bearer test-access-token');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    afterEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    it('должен создать заказ, показать номер и очистить конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      // Добавляем начинку
      cy.contains('Говяжий метеорит (отбивная)')
        .closest('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      // Оформляем заказ
      cy.get('[data-testid="order-button"]').click();
      cy.wait('@createOrder');

      // Проверяем модалку с номером заказа
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="order-number"]').should('contain', '12345');

      // Закрываем модалку
      cy.get('[data-testid="modal-close"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');

      // Проверяем что конструктор очистился
      cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
      cy.get('[data-testid="constructor-ingredients"]').should(
        'not.contain',
        'Говяжий метеорит'
      );
    });
  });
});