import { types as t, PluginObj, traverse } from 'babel-core'

export default (): PluginObj => ({
  visitor: {
    LabeledStatement (node) {
      const label = node.get('label')
      if (!label.isIdentifier() || label.node.name !== 'arraify') return
      const b = node.get('body')
      if (!b.isExpressionStatement()) return node.remove()
      const body = b.get('expression')
      const vars = body.isIdentifier()
        ? [body.node.name]
        : body.isSequenceExpression()
          ? body.node.expressions.map(i => t.isIdentifier(i) && i.name).filter(Boolean)
          : null
      node.remove()
      if (!vars || !vars.length) return
      traverse(node.parent, {
        Identifier (path) {
          if (!vars.includes(path.node.name)) return
          const m = path.parentPath
          if (!m.isMemberExpression()) return
          const expr = m.parentPath
          const prop = m.get('property')
          if (prop.isIdentifier() && prop.node.name === 'length') {
            expr.replaceWith(
              t.callExpression(
                t.memberExpression(path.node, t.identifier('size')),
                []
              )
            )
          } else if (prop.isNumericLiteral()) {
            if (expr.isAssignmentExpression() && expr.node.operator === '=') {
              expr.replaceWith(
                t.callExpression(
                  t.memberExpression(path.node, t.identifier('set')),
                  [prop.node, expr.node.right]
                )
              )
            } else if (expr.isUnaryExpression() && expr.node.operator === 'delete') {
              expr.replaceWith(
                t.callExpression(
                  t.memberExpression(path.node, t.identifier('set')),
                  [prop.node]
                )
              )
            } else {
              expr.replaceWith(
                t.callExpression(
                  t.memberExpression(path.node, t.identifier('get')),
                  [prop.node]
                )
              )
            }
          }
        }
      })
    }
  }
})
