// This is an example of how to protect content using server rendering
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"

export default function Page({ content, session }) {
  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <h1>Protected Page</h1>
      <p>
        <strong>{content}</strong>
      </p>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context, authOptions)
  let content = null

  if (session) {
    if (!process.env.NEXTAUTH_URL) throw new Error('getServerSideProps does not have NEXTAUTH_URL')
    const hostname = process.env.NEXTAUTH_URL
    const options = { headers: { cookie: context.req.headers.cookie } }
    const res = await fetch(`${hostname}/api/examples/protected`, options)
    const json = await res.json()
    if (json.content) {
      content = json.content
    }
  }

  return {
    props: {
      session,
      content,
    },
  }
}
