import Link from "next/link";
export default function NotFound() {
  return (
    <div className="panel empty-state">
      <p className="eyebrow">404 / NOT FOUND</p>
      <h1 className="text-3xl my-5">This page is outside the dataset.</h1>
      <p className="muted">
        The page or cryptocurrency you requested does not exist.
      </p>
      <Link className="button mt-6" href="/crypto">
        Back to the explorer
      </Link>
    </div>
  );
}
