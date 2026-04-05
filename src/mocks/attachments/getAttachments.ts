import { rest } from "msw";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export const attachmentsHandlers = [
  rest.post(`${baseUrl}/Attachment/search`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            attachments: [
              {
                identifier: "UUID-EXAMPLE-1234",
                url: "https://document-sat-prod.s3.amazonaws.com/cf_96f8e9a3-530f-4d10-84ff-9264fdcaba3c.pdf?response-content-disposition=attachment%3Bfilename%3DPGD1009214W0_ConstanciaSituacionFiscal_10Dec2025.pdf&AWSAccessKeyId=ASIAQLWWJNI57CR6YFSU&Signature=lZxLzveGLYBL72Unleu3jBy19w0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEBkaCXVzLWVhc3QtMSJHMEUCIQDXmj1KXMWNMXeEtrB7jtXj%2FI4EebJYMuIbAo6jf%2FdoRwIgQE5hYBHtqVzUCapp1Ntvbpm2Eae0MBqG%2BuOrD1ejkcsqzAMI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgwwMjUxNDU0Njk0OTkiDF8u%2BKcYWWFhihSGGiqgAxI3%2BoHBFGWmwxQneUwf3hd9lgAaaA8578RVJwdkBr0I7Z8FH18dz5tHk43A7kKeScvlx3EeAJFTQ2F1cj7OJeTO3jp4BEX5Zuz46gCN6KqmwB4e1qbbDU18ToM0wnf9I8pvSLlKNn%2F80PD2xh1YToDr68JyCGCKTmOVUG%2BpsTaOd2Q%2FevQQJm9zJPk%2FqgmQjgmoW3Bjt4FXJHl4wxUuGrOD0Q7%2FfD%2F5lT%2F9wfweQ%2FgWh47fWSpCTfW0%2F9ECWZOb2AdFejGWXpNaA1JwADN99f5a3HJvUmR5U13uplfknkw4gyUR7uFvAYfwEYKQLKHzgw%2BDcSId2DP4TKTcns6LsVyrASm7n1qMt3zfx4nzeUlajO4Mx588e%2BGWKPo0n2UKZYepD%2Bjx478SY23w%2F6iK2LkFkMN%2FKANSTF9zSSI%2Fo0LWwJzBO9mUmbtF0c56XlC0FJilnEQT4W1LsHJ9gAZqxfUqOv6PdpqYVwRFE3Sge0W5CIGNMwE2S0E%2FmMqKElnOaoHPEgeN8L%2FoPmZcjYTmdz3ABFK%2BYsjYcq7amlAyVPzmMJKv6MkGOp4BUHAWtc6fmtFe8I5ECB0Orzih6MNNmfPySMpksBRwXb3pZ%2FaWvUnerceMrmVmrYiYL6b4JyU4LY2ElXh0CgNxBFSsqdbzvyLKcyBtJ0i3CDfg80lmNRnPJL1%2F5HRkWKMbJeH1L8GO3TRsTsQY3%2Bz3Sbo%2FVHc4WStOqEI1Dc4ED7HoArFQqj0PkJsMsQ8yammJ76a3AP6JDMbf2XAgKvw%3D&Expires=1765444636",
                status: true,
                name: "imagen-1.png",
              },
              {
                identifier: "UUID-EXAMPLE-5678",
                url: "https://document-sat-prod.s3.amazonaws.com/cf_96f8e9a3-530f-4d10-84ff-9264fdcaba3c.pdf?response-content-disposition=attachment%3Bfilename%3DPGD1009214W0_ConstanciaSituacionFiscal_10Dec2025.pdf&AWSAccessKeyId=ASIAQLWWJNI57CR6YFSU&Signature=lZxLzveGLYBL72Unleu3jBy19w0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEBkaCXVzLWVhc3QtMSJHMEUCIQDXmj1KXMWNMXeEtrB7jtXj%2FI4EebJYMuIbAo6jf%2FdoRwIgQE5hYBHtqVzUCapp1Ntvbpm2Eae0MBqG%2BuOrD1ejkcsqzAMI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgwwMjUxNDU0Njk0OTkiDF8u%2BKcYWWFhihSGGiqgAxI3%2BoHBFGWmwxQneUwf3hd9lgAaaA8578RVJwdkBr0I7Z8FH18dz5tHk43A7kKeScvlx3EeAJFTQ2F1cj7OJeTO3jp4BEX5Zuz46gCN6KqmwB4e1qbbDU18ToM0wnf9I8pvSLlKNn%2F80PD2xh1YToDr68JyCGCKTmOVUG%2BpsTaOd2Q%2FevQQJm9zJPk%2FqgmQjgmoW3Bjt4FXJHl4wxUuGrOD0Q7%2FfD%2F5lT%2F9wfweQ%2FgWh47fWSpCTfW0%2F9ECWZOb2AdFejGWXpNaA1JwADN99f5a3HJvUmR5U13uplfknkw4gyUR7uFvAYfwEYKQLKHzgw%2BDcSId2DP4TKTcns6LsVyrASm7n1qMt3zfx4nzeUlajO4Mx588e%2BGWKPo0n2UKZYepD%2Bjx478SY23w%2F6iK2LkFkMN%2FKANSTF9zSSI%2Fo0LWwJzBO9mUmbtF0c56XlC0FJilnEQT4W1LsHJ9gAZqxfUqOv6PdpqYVwRFE3Sge0W5CIGNMwE2S0E%2FmMqKElnOaoHPEgeN8L%2FoPmZcjYTmdz3ABFK%2BYsjYcq7amlAyVPzmMJKv6MkGOp4BUHAWtc6fmtFe8I5ECB0Orzih6MNNmfPySMpksBRwXb3pZ%2FaWvUnerceMrmVmrYiYL6b4JyU4LY2ElXh0CgNxBFSsqdbzvyLKcyBtJ0i3CDfg80lmNRnPJL1%2F5HRkWKMbJeH1L8GO3TRsTsQY3%2Bz3Sbo%2FVHc4WStOqEI1Dc4ED7HoArFQqj0PkJsMsQ8yammJ76a3AP6JDMbf2XAgKvw%3D&Expires=1765444636",
                status: true,
                name: "imagen-2.png",
              },
              {
                identifier: "UUID-EXAMPLE-5678",
                url: "https://document-sat-prod.s3.amazonaws.com/cf_96f8e9a3-530f-4d10-84ff-9264fdcaba3c.pdf?response-content-disposition=attachment%3Bfilename%3DPGD1009214W0_ConstanciaSituacionFiscal_10Dec2025.pdf&AWSAccessKeyId=ASIAQLWWJNI57CR6YFSU&Signature=lZxLzveGLYBL72Unleu3jBy19w0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEBkaCXVzLWVhc3QtMSJHMEUCIQDXmj1KXMWNMXeEtrB7jtXj%2FI4EebJYMuIbAo6jf%2FdoRwIgQE5hYBHtqVzUCapp1Ntvbpm2Eae0MBqG%2BuOrD1ejkcsqzAMI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgwwMjUxNDU0Njk0OTkiDF8u%2BKcYWWFhihSGGiqgAxI3%2BoHBFGWmwxQneUwf3hd9lgAaaA8578RVJwdkBr0I7Z8FH18dz5tHk43A7kKeScvlx3EeAJFTQ2F1cj7OJeTO3jp4BEX5Zuz46gCN6KqmwB4e1qbbDU18ToM0wnf9I8pvSLlKNn%2F80PD2xh1YToDr68JyCGCKTmOVUG%2BpsTaOd2Q%2FevQQJm9zJPk%2FqgmQjgmoW3Bjt4FXJHl4wxUuGrOD0Q7%2FfD%2F5lT%2F9wfweQ%2FgWh47fWSpCTfW0%2F9ECWZOb2AdFejGWXpNaA1JwADN99f5a3HJvUmR5U13uplfknkw4gyUR7uFvAYfwEYKQLKHzgw%2BDcSId2DP4TKTcns6LsVyrASm7n1qMt3zfx4nzeUlajO4Mx588e%2BGWKPo0n2UKZYepD%2Bjx478SY23w%2F6iK2LkFkMN%2FKANSTF9zSSI%2Fo0LWwJzBO9mUmbtF0c56XlC0FJilnEQT4W1LsHJ9gAZqxfUqOv6PdpqYVwRFE3Sge0W5CIGNMwE2S0E%2FmMqKElnOaoHPEgeN8L%2FoPmZcjYTmdz3ABFK%2BYsjYcq7amlAyVPzmMJKv6MkGOp4BUHAWtc6fmtFe8I5ECB0Orzih6MNNmfPySMpksBRwXb3pZ%2FaWvUnerceMrmVmrYiYL6b4JyU4LY2ElXh0CgNxBFSsqdbzvyLKcyBtJ0i3CDfg80lmNRnPJL1%2F5HRkWKMbJeH1L8GO3TRsTsQY3%2Bz3Sbo%2FVHc4WStOqEI1Dc4ED7HoArFQqj0PkJsMsQ8yammJ76a3AP6JDMbf2XAgKvw%3D&Expires=1765444636",
                status: true,
                name: "imagen-3.png",
              },
              {
                identifier: "UUID-EXAMPLE-5678",
                url: "https://document-sat-prod.s3.amazonaws.com/cf_96f8e9a3-530f-4d10-84ff-9264fdcaba3c.pdf?response-content-disposition=attachment%3Bfilename%3DPGD1009214W0_ConstanciaSituacionFiscal_10Dec2025.pdf&AWSAccessKeyId=ASIAQLWWJNI57CR6YFSU&Signature=lZxLzveGLYBL72Unleu3jBy19w0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEBkaCXVzLWVhc3QtMSJHMEUCIQDXmj1KXMWNMXeEtrB7jtXj%2FI4EebJYMuIbAo6jf%2FdoRwIgQE5hYBHtqVzUCapp1Ntvbpm2Eae0MBqG%2BuOrD1ejkcsqzAMI4v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgwwMjUxNDU0Njk0OTkiDF8u%2BKcYWWFhihSGGiqgAxI3%2BoHBFGWmwxQneUwf3hd9lgAaaA8578RVJwdkBr0I7Z8FH18dz5tHk43A7kKeScvlx3EeAJFTQ2F1cj7OJeTO3jp4BEX5Zuz46gCN6KqmwB4e1qbbDU18ToM0wnf9I8pvSLlKNn%2F80PD2xh1YToDr68JyCGCKTmOVUG%2BpsTaOd2Q%2FevQQJm9zJPk%2FqgmQjgmoW3Bjt4FXJHl4wxUuGrOD0Q7%2FfD%2F5lT%2F9wfweQ%2FgWh47fWSpCTfW0%2F9ECWZOb2AdFejGWXpNaA1JwADN99f5a3HJvUmR5U13uplfknkw4gyUR7uFvAYfwEYKQLKHzgw%2BDcSId2DP4TKTcns6LsVyrASm7n1qMt3zfx4nzeUlajO4Mx588e%2BGWKPo0n2UKZYepD%2Bjx478SY23w%2F6iK2LkFkMN%2FKANSTF9zSSI%2Fo0LWwJzBO9mUmbtF0c56XlC0FJilnEQT4W1LsHJ9gAZqxfUqOv6PdpqYVwRFE3Sge0W5CIGNMwE2S0E%2FmMqKElnOaoHPEgeN8L%2FoPmZcjYTmdz3ABFK%2BYsjYcq7amlAyVPzmMJKv6MkGOp4BUHAWtc6fmtFe8I5ECB0Orzih6MNNmfPySMpksBRwXb3pZ%2FaWvUnerceMrmVmrYiYL6b4JyU4LY2ElXh0CgNxBFSsqdbzvyLKcyBtJ0i3CDfg80lmNRnPJL1%2F5HRkWKMbJeH1L8GO3TRsTsQY3%2Bz3Sbo%2FVHc4WStOqEI1Dc4ED7HoArFQqj0PkJsMsQ8yammJ76a3AP6JDMbf2XAgKvw%3D&Expires=1765444636",
                status: true,
                name: "imagen-4.png",
              }

            ],
          },
          {
            FechaFiltro: "2019-01-18T00:00:00",
            polizas: [],
          },
        ],
        next_page: false,
        total_records: 2,
      })
    );
  }),
];
