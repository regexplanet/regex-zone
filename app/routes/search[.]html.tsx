import type { MetaFunction } from "@remix-run/node";
import { HeaderSearch } from "~/components/HeaderSearch/HeaderSearch";
import { Container } from 'react-bootstrap';
import { Footer } from "~/components/Footer";

export const meta: MetaFunction = () => {
    return [
        { title: "Regex Zone" },
        { name: "description", content: "Useful regular expression resources" },
    ];
};

export default function Index() {
    return (
        <>
            <HeaderSearch />
            <Container>
                <h1 className="py-2">Search</h1>
                <div className="alert alert-info">
                    Coming soon...
                </div>
                <Footer />
            </Container>
        </>
    );
}