describe('快捷键测试', () => {
  it('弹窗测试', () => {
    cy.visit('http://192.168.0.116:3090/');
    cy.get('#nextui-modal').should('be.empty');
    cy.get('body').type('{ctrl}{shift}p');
    cy.get('#nextui-modal').should('not.be.empty');
    cy.get('body').type('{esc}');
    cy.get('#nextui-modal').should('be.empty');
  });

  it('菜单测试', () => {
    cy.visit('http://192.168.0.116:3090/');
    // cy.get('body').type('{ctrl}b');
  });
});
