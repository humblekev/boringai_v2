"""
BoringAI Business Consultant using LangGraph
"""

import os
from typing import List, Dict, Any, TypedDict
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END
import logging

logger = logging.getLogger(__name__)

class ConversationState(TypedDict):
    """State for the conversation workflow"""
    messages: List[Dict[str, str]]
    user_context: Dict[str, Any]
    current_stage: str
    business_analysis: Dict[str, Any]
    recommendations: List[str]
    confidence_score: float

class BoringAIConsultant:
    """LangGraph-based AI business consultant"""

    def __init__(self):
        """Initialize the consultant with LangGraph workflow"""
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,
            api_key=os.getenv("OPENAI_API_KEY")
        )

        # Define the conversation workflow
        self.workflow = self._create_workflow()

        # Business consultant personality
        self.system_prompt = """You are a senior business consultant for BoringAI, a company that specializes in practical AI and automation solutions. Your personality and approach:

TONE & STYLE:
- Professional but approachable
- Focus on business value, not technical details
- Ask practical, business-focused questions
- Avoid AI/tech jargon - speak in business terms
- Be honest about limitations and realistic about outcomes

YOUR EXPERTISE:
- Business process optimization
- Identifying automation opportunities
- ROI analysis for AI implementations
- Change management for automation projects
- Industry-specific automation solutions

CONVERSATION GOALS:
1. Understand the business challenge clearly
2. Identify specific pain points and bottlenecks
3. Assess automation potential and ROI
4. Provide practical next steps
5. Qualify if they're a good fit for BoringAI services

RESPONSE GUIDELINES:
- Keep responses conversational and under 150 words
- Ask follow-up questions to understand their business better
- Focus on business impact (time saved, costs reduced, revenue increased)
- When discussing solutions, be specific but not overly technical
- If appropriate, suggest a consultation with the BoringAI team

Remember: You're not just answering questions - you're conducting a business consultation to help them identify valuable automation opportunities."""

    def _create_workflow(self) -> StateGraph:
        """Create the LangGraph workflow for business consultation"""

        workflow = StateGraph(ConversationState)

        # Define workflow nodes
        workflow.add_node("analyze_intent", self._analyze_intent)
        workflow.add_node("business_consultation", self._business_consultation)
        workflow.add_node("solution_recommendation", self._solution_recommendation)
        workflow.add_node("qualification_assessment", self._qualification_assessment)

        # Define the flow
        workflow.set_entry_point("analyze_intent")

        workflow.add_conditional_edges(
            "analyze_intent",
            self._route_conversation,
            {
                "consultation": "business_consultation",
                "recommendation": "solution_recommendation",
                "qualification": "qualification_assessment"
            }
        )

        workflow.add_edge("business_consultation", END)
        workflow.add_edge("solution_recommendation", END)
        workflow.add_edge("qualification_assessment", END)

        return workflow.compile()

    def _analyze_intent(self, state: ConversationState) -> ConversationState:
        """Analyze user intent and conversation stage"""

        recent_messages = state["messages"][-3:] if len(state["messages"]) > 3 else state["messages"]

        # Simple intent classification based on conversation flow
        message_count = len(state["messages"])
        last_user_message = state["messages"][-1]["content"] if state["messages"] else ""

        # Determine conversation stage
        if message_count <= 2:
            stage = "consultation"  # Initial consultation phase
        elif any(keyword in last_user_message.lower() for keyword in ["cost", "price", "budget", "timeline"]):
            stage = "qualification"  # Business qualification
        elif any(keyword in last_user_message.lower() for keyword in ["solution", "recommend", "what should", "how can"]):
            stage = "recommendation"  # Solution recommendation
        else:
            stage = "consultation"  # Continue consultation

        state["current_stage"] = stage
        return state

    def _route_conversation(self, state: ConversationState) -> str:
        """Route conversation based on current stage"""
        return state["current_stage"]

    def _business_consultation(self, state: ConversationState) -> ConversationState:
        """Conduct business consultation and gather requirements"""

        messages = self._format_messages_for_llm(state["messages"])

        consultation_prompt = f"""{self.system_prompt}

CURRENT CONVERSATION STAGE: Business Consultation
Your goal is to understand their business challenge and identify automation opportunities.

Guidelines for this response:
- Ask specific questions about their current processes
- Identify pain points and bottlenecks
- Understand the business impact of their challenges
- Keep the conversation flowing naturally
- Focus on business outcomes, not technical solutions yet"""

        try:
            response = self.llm.invoke([
                SystemMessage(content=consultation_prompt),
                *messages
            ])

            state["business_analysis"] = {
                "stage": "consultation",
                "identified_challenges": self._extract_challenges(state["messages"]),
                "business_context": self._extract_business_context(state["messages"])
            }
            state["confidence_score"] = 0.8

            return state

        except Exception as e:
            logger.error(f"Error in business consultation: {str(e)}")
            state["confidence_score"] = 0.3
            return state

    def _solution_recommendation(self, state: ConversationState) -> ConversationState:
        """Provide specific solution recommendations"""

        messages = self._format_messages_for_llm(state["messages"])

        recommendation_prompt = f"""{self.system_prompt}

CURRENT CONVERSATION STAGE: Solution Recommendation
Based on the conversation, provide specific, practical automation recommendations.

Guidelines for this response:
- Suggest specific automation solutions based on their challenges
- Explain business benefits (time saved, cost reduction, efficiency gains)
- Be realistic about what's possible
- Avoid technical jargon - focus on business outcomes
- If appropriate, suggest next steps or consultation"""

        try:
            response = self.llm.invoke([
                SystemMessage(content=recommendation_prompt),
                *messages
            ])

            state["recommendations"] = ["Process automation assessment", "Custom solution design"]
            state["confidence_score"] = 0.9

            return state

        except Exception as e:
            logger.error(f"Error in solution recommendation: {str(e)}")
            state["confidence_score"] = 0.4
            return state

    def _qualification_assessment(self, state: ConversationState) -> ConversationState:
        """Assess if the prospect is qualified for BoringAI services"""

        messages = self._format_messages_for_llm(state["messages"])

        qualification_prompt = f"""{self.system_prompt}

CURRENT CONVERSATION STAGE: Business Qualification
The prospect is showing interest in pricing/timeline. Assess their fit for BoringAI services.

Guidelines for this response:
- Understand their budget and timeline expectations
- Assess the complexity and scope of their needs
- Determine if they're a good fit for BoringAI's practical approach
- If qualified, suggest a consultation with the BoringAI team
- Be honest about whether BoringAI can help or if they need different solutions"""

        try:
            response = self.llm.invoke([
                SystemMessage(content=qualification_prompt),
                *messages
            ])

            state["business_analysis"]["qualification_stage"] = True
            state["confidence_score"] = 0.85

            return state

        except Exception as e:
            logger.error(f"Error in qualification assessment: {str(e)}")
            state["confidence_score"] = 0.3
            return state

    def _format_messages_for_llm(self, messages: List[Dict[str, str]]) -> List:
        """Convert message history to LangChain format"""
        formatted = []

        for msg in messages:
            # Handle both dict and object formats
            if isinstance(msg, dict):
                role = msg.get("role", "")
                content = msg.get("content", "")
            else:
                # Handle ChatMessage objects
                role = getattr(msg, "role", "")
                content = getattr(msg, "content", "")

            if role == "user":
                formatted.append(HumanMessage(content=content))
            elif role == "assistant":
                formatted.append(AIMessage(content=content))

        return formatted

    def _extract_challenges(self, messages: List[Dict[str, str]]) -> List[str]:
        """Extract business challenges mentioned in conversation"""
        challenges = []

        for msg in messages:
            # Handle both dict and object formats
            if isinstance(msg, dict):
                role = msg.get("role", "")
                content = msg.get("content", "")
            else:
                role = getattr(msg, "role", "")
                content = getattr(msg, "content", "")

            if role == "user":
                content_lower = content.lower()
                if any(keyword in content_lower for keyword in ["problem", "challenge", "difficult", "manual", "time consuming"]):
                    challenges.append(content[:100])

        return challenges[:3]  # Limit to top 3

    def _extract_business_context(self, messages: List[Dict[str, str]]) -> Dict[str, str]:
        """Extract business context from conversation"""
        context = {}

        for msg in messages:
            # Handle both dict and object formats
            if isinstance(msg, dict):
                role = msg.get("role", "")
                content = msg.get("content", "")
            else:
                role = getattr(msg, "role", "")
                content = getattr(msg, "content", "")

            if role == "user":
                content_lower = content.lower()

                # Extract industry hints
                industries = ["healthcare", "finance", "retail", "manufacturing", "saas", "ecommerce"]
                for industry in industries:
                    if industry in content_lower:
                        context["industry"] = industry
                        break

                # Extract company size hints
                if any(size in content_lower for size in ["startup", "small business"]):
                    context["company_size"] = "small"
                elif any(size in content_lower for size in ["enterprise", "large company"]):
                    context["company_size"] = "large"

        return context

    async def process_message(
        self,
        message: str,
        conversation_history: List[Dict[str, str]],
        user_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process user message through the LangGraph workflow"""

        # Add new message to history
        updated_history = conversation_history + [{"role": "user", "content": message}]

        # Create initial state
        initial_state: ConversationState = {
            "messages": updated_history,
            "user_context": user_context,
            "current_stage": "consultation",
            "business_analysis": {},
            "recommendations": [],
            "confidence_score": 0.5
        }

        try:
            # Run through workflow
            result_state = await self.workflow.ainvoke(initial_state)

            # Generate response using the LLM
            messages = self._format_messages_for_llm(result_state["messages"])

            # Get the appropriate prompt based on current stage
            stage_prompts = {
                "consultation": f"{self.system_prompt}\n\nFocus on understanding their business needs and challenges.",
                "recommendation": f"{self.system_prompt}\n\nProvide specific automation recommendations based on the conversation.",
                "qualification": f"{self.system_prompt}\n\nAssess their fit for BoringAI services and suggest next steps."
            }

            prompt = stage_prompts.get(result_state["current_stage"], self.system_prompt)

            response = self.llm.invoke([
                SystemMessage(content=prompt),
                *messages
            ])

            return {
                "response": response.content,
                "state": result_state["current_stage"],
                "suggested_actions": result_state["recommendations"],
                "confidence_score": result_state["confidence_score"],
                "business_analysis": result_state["business_analysis"]
            }

        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")

            # Fallback response
            return {
                "response": "I apologize, but I'm experiencing some technical difficulties. Could you please rephrase your question? I'm here to help you identify automation opportunities for your business.",
                "state": "consultation",
                "suggested_actions": [],
                "confidence_score": 0.1,
                "business_analysis": {}
            }