import AuthUi from './AuthUi'

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
    const searchParams = await props.searchParams
    return <AuthUi message={searchParams.message} />
}
