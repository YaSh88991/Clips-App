describe('My First Test', () => {
  it('is sanity test', () => {
    cy.visit('/')
    cy.contains('#header .text-3xl', 'Clipz')
  })
})
