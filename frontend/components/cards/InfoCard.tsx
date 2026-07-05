type Props = {
    children: React.ReactNode;
};

export default function InfoCard({
                                     children,
                                 }: Props) {

    return (
        <div className="rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            {children}
        </div>
    );

}