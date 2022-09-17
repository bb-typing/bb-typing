const url = 'http://localhost:3090';

describe('快捷键测试', () => {
  it('弹窗测试', () => {
    cy.visit(url);
    cy.get('#nextui-modal').should('be.empty');
    cy.get('body').type('{ctrl}{shift}p');
    cy.get('#nextui-modal').should('not.be.empty');
    cy.get('body').type('{esc}');
    cy.get('#nextui-modal').should('be.empty');
  });

  it('菜单测试', () => {
    cy.visit(url);
    // cy.get('body').type('{ctrl}b');
  });
});
