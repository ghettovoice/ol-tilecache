const OPENLAYERS_PKG = 'openlayers'
const OL_REGEX = /^ol(?:\/(.*))?$/
const OL_VAR = '_openlayers_'

const genNestedMemberExpression = (node, names, t) => {
  names = names.reverse()
  if (node.name[ 0 ] === node.name[ 0 ].toUpperCase() && names.length) {
    names[ 0 ] = names[ 0 ][ 0 ].toUpperCase() + names[ 0 ].substr(1)
  }

  return t.memberExpression(
    names.slice(1).reduce(
      (node, name) => t.memberExpression(
        node,
        t.identifier(name)
      ),
      t.identifier(OL_VAR)
    ),
    t.identifier(names[ 0 ])
  )
}

module.exports = function ({ types : t }) {
  const imports = {}

  return {
    visitor: {
      Program (path) {
        path.node.body.unshift(
          t.variableDeclaration(
            'var',
            [
              t.variableDeclarator(
                t.identifier(OL_VAR),
                t.callExpression(
                  t.identifier('require'),
                  [
                    t.stringLiteral(OPENLAYERS_PKG)
                  ]
                )
              )
            ]
          )
        )
      },
      ImportDeclaration (path) {
        const node = path.node
        const spec = node.specifiers.find(spec => t.isImportDefaultSpecifier(spec))
        const matches = node.source.value.match(OL_REGEX)

        if (spec && matches) {
          imports[ spec.local.name ] = matches[ 1 ].split('/')
          path.remove()
        }
      },
      Identifier (path) {
        if (imports[ path.node.name ]) {
          if (path.parentPath.node.callee) {
            path.parentPath.node.callee = genNestedMemberExpression(path.node, imports[ path.node.name ], t)
          } else if (path.parentPath.node.object) {
            path.parentPath.node.object = genNestedMemberExpression(path.node, imports[ path.node.name ], t)
          }
        }
      }
    }
  }
}
