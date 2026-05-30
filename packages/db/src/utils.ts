import {
  type ExpressionBuilder,
  type ReferenceExpression,
  type SelectQueryBuilder,
} from "kysely"
import { executeWithOffsetPagination } from "kysely-paginate"

export const safeIn = <DB, TB extends keyof DB>(
  eb: ExpressionBuilder<DB, TB>,
  column: ReferenceExpression<DB, TB>,
  values: readonly unknown[],
) => {
  if (values.length === 0) {
    return eb.lit(false)
  }

  return eb(column, "in", values)
}

export type Paginate = {
  pageSize: number
  pageIndex: number
}

export const countQuery = <O, DB, TB extends keyof DB>(
  qb: SelectQueryBuilder<DB, TB, O>,
  column: ReferenceExpression<DB, TB>,
) =>
  qb
    .clearSelect()
    .clearOrderBy()
    .clearGroupBy()
    .select((eb) => eb.fn.count<number>(column).as("count"))
    .limit(1)
    .executeTakeFirstOrThrow()

export const paginateQuery = async <O, DB, TB extends keyof DB>(
  query: SelectQueryBuilder<DB, TB, O>,
  pagination: Paginate,
  countColumn: ReferenceExpression<DB, TB>,
) => {
  const { count } = (await countQuery(query, countColumn)) as { count: number }

  const result = await executeWithOffsetPagination(query, {
    perPage: pagination.pageSize,
    page: pagination.pageIndex + 1,
  })

  return {
    result: result.rows,
    count,
  }
}
