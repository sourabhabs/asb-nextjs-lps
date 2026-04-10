declare module "mysql2/promise" {
  interface ExecuteResult {
    insertId?: number;
  }

  interface MysqlConnection {
    execute(sql: string, values?: unknown[]): Promise<[ExecuteResult, unknown]>;
    end(): Promise<void>;
  }

  export function createConnection(config: {
    host: string;
    user: string;
    password: string;
    database: string;
  }): Promise<MysqlConnection>;
}
