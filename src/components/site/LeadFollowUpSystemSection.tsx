export function LeadFollowUpSystemSection() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600">
            Lead & Follow-up System
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Turn incoming requests into a controlled follow-up workflow.
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            SmartFlow Suisse helps small and medium businesses structure incoming
            requests, prepare follow-up faster, and preview client conversion
            before any external or irreversible action.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Structured intake
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Capture requests from forms, email, or spreadsheets and turn
                them into a clear lead workflow.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                AI-assisted summary
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use AI to support summary, priority, and next-action preparation
                while keeping human review in control.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Manual follow-up
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Prepare context and follow-up safely without automatic external
                sending or mass outreach.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-950">
                Human approval
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Preview conversion before real client creation, database
                changes, or external actions.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-200 bg-brand-50 p-5">
          <h3 className="text-base font-semibold text-brand-900">
            Demo workflow
          </h3>

          <ol className="mt-4 space-y-3 text-sm leading-6 text-brand-900">
            <li>1. Request received</li>
            <li>2. Lead structured</li>
            <li>3. AI-assisted summary prepared</li>
            <li>4. Follow-up reviewed manually</li>
            <li>5. Convert to Client preview shown</li>
            <li>6. Human approval before action</li>
          </ol>

          <div className="mt-6 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">
            <p className="font-semibold text-slate-950">
              Safety-first principle
            </p>
            <p className="mt-2">
              The system prepares the work. Your team approves the action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
