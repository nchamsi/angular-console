import {
  checkDisplayedCommand,
  clickOnTask,
  goBack,
  goToExtensions,
  goToGenerate,
  openProject,
  projectPath,
  taskListHeaders,
  tasks,
  texts,
  waitForActionToComplete,
  waitForAnimation
} from './utils';

describe('Extensions', () => {
  beforeEach(() => {
    cy.visit('/workspaces');
    openProject(projectPath('proj-extensions'));
    goToExtensions();
    cy.get('div.title').contains('Add CLI Extensions');
  });

  it('filters extensions', () => {
    tasks($p => {
      const t = texts($p);
      expect(t[0].indexOf('@nrwl/schematics') > -1).to.equal(true);
    });

    // filter by item
    cy.get('input#filter').type('serverless');
    tasks($p => {
      const t = texts($p);
      expect(t[0].indexOf('@angular-toolkit/serverless') > -1).to.equal(true);
    });
  });

  it('adds an extension', () => {
    clickOnTask('Available Extensions', '@angular/material', false);
    cy.get('div.context-title').contains('@angular/material');

    cy.get('button')
      .contains('Add')
      .click();

    checkDisplayedCommand(`$ ng add @angular/material`);

    waitForActionToComplete();

    goBack();

    cy.get('div.title').contains('Add CLI Extensions');
    taskListHeaders($p => {
      expect(texts($p)[0]).to.equal('Available Extensions');
    });
    waitForAnimation();

    // check that the schematics added by angular material are available
    goToGenerate();
    taskListHeaders($p => {
      expect(texts($p)[0]).to.equal('@angular/material');
    });
  });
});
